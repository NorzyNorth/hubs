import { useEffect, useReducer, useRef, useCallback } from "react";
import { useIntl, defineMessages } from "react-intl";
import { waitForPreloads } from "../../../utils/preload";
import { shouldUseNewLoader } from "../../../utils/bit-utils";

function reducer(state, action) {
  switch (action.type) {
    case "done-preloading":
      return { ...state, donePreloading: true };
    case "object-loading":
      return { ...state, objectCount: state.objectCount + 1 };
    case "object-loaded":
      return { ...state, loadedCount: state.loadedCount + 1 };
    case "all-objects-loaded":
      return {
        ...state,
        allObjectsLoaded: true
      };
    case "environment-loaded": {
      return {
        ...state,
        environmentLoaded: true
      };
    }
    case "network-connected":
      return {
        ...state,
        networkConnected: true
      };
    case "dialog-connected":
      return {
        ...state,
        dialogConnected: true
      };
  }
}

// defineMessages informs babel-plugin-react-intl what i18n data can be stripped/embedded when bundling.
const messages = defineMessages({
  default: {
    id: "loading-screen.default",
    description: "Началась загрузка сцены.",
    defaultMessage: "Загрузка сцены..."
  },
  loadingObjects: {
    id: "loading-screen.loading-objects",
    description: "Ход загрузки. Сколько объектов закончили загрузку?",
    defaultMessage: "Загрузка объектов{loadedCount}/{objectCount}"
  },
  connectingScene: {
    id: "loading-screen.connecting",
    description: "Сцена загружена, мы ждем подключения сетевой сцены для входа.",
    defaultMessage: "Подключение к сцене..."
  },
  enteringRoom: {
    id: "loading-screen.entering-room",
    description:
      "После завершения загрузки сцены это сообщение сообщает пользователям о том, что они скоро войдут в комнату.",
    defaultMessage: "Входим в комнату..."
  }
});

export function useRoomLoadingState(sceneEl) {
  // Holds the id of the current
  const loadingTimeoutRef = useRef();
  const lazyLoadMedia = APP.store.state.preferences.lazyLoadSceneMedia;

  const [
    {
      environmentLoaded,
      networkConnected,
      dialogConnected,
      allObjectsLoaded,
      donePreloading,
      objectCount,
      loadedCount
    },
    dispatch
  ] = useReducer(reducer, {
    objectCount: 0,
    loadedCount: 0,
    allObjectsLoaded: false,
    environmentLoaded: false,
    networkConnected: false,
    dialogConnected: false,
    donePreloading: false,
    lazyLoadMedia
  });
  // Skip object loading callbacks for the newLoader, since they don't yet fire events we can listen to.
  const doneLoadingObjects = lazyLoadMedia || shouldUseNewLoader() || allObjectsLoaded;
  const done =
    sceneEl.is("loaded") ||
    (environmentLoaded && networkConnected && dialogConnected && doneLoadingObjects && donePreloading);

  let messageKey = "default";
  if (!environmentLoaded) {
    messageKey = "default";
  } else if (!networkConnected || !dialogConnected) {
    messageKey = "connectingScene";
  } else if (!doneLoadingObjects) {
    messageKey = "loadingObjects";
  } else {
    messageKey = "enteringRoom";
  }

  const onObjectLoading = useCallback(() => {
    clearTimeout(loadingTimeoutRef.current);
    dispatch({ type: "object-loading" });
  }, [dispatch]);

  const onObjectLoaded = useCallback(() => {
    clearTimeout(loadingTimeoutRef.current);

    dispatch({ type: "object-loaded" });

    // Objects can start loading as a result of loading another object. Wait 1.5 seconds before calling
    // all-objects-loaded to try to catch loading all objects.
    // TODO: Determine a better way to ensure the object dependency chain has resolved, or switch to a
    // progressive loading model where all objects don't have to be loaded to enter the room.
    loadingTimeoutRef.current = setTimeout(() => {
      dispatch({ type: "all-objects-loaded" });
    }, 1500);
  }, [dispatch]);

  const onEnvironmentLoaded = useCallback(() => {
    dispatch({ type: "environment-loaded" });
  }, [dispatch]);

  const onNetworkConnected = useCallback(() => {
    dispatch({ type: "network-connected" });
  }, [dispatch]);

  const onDialogConnected = useCallback(() => {
    dispatch({ type: "dialog-connected" });
  }, [dispatch]);

  useEffect(() => {
    waitForPreloads().then(() => {
      // TODO: Is this OK to do? Seems bad to be async here somehow
      dispatch({ type: "done-preloading" });
    });
    return () => {};
  }, []);

  useEffect(() => {
    // Once the scene has loaded the dependencies to this hook will change,
    // the event listeners will be removed, and we can prevent adding them again.
    if (!done) {
      if (!lazyLoadMedia) {
        sceneEl.addEventListener("model-loading", onObjectLoading);
        sceneEl.addEventListener("image-loading", onObjectLoading);
        sceneEl.addEventListener("pdf-loading", onObjectLoading);
        sceneEl.addEventListener("video-loading", onObjectLoading);
        sceneEl.addEventListener("model-loaded", onObjectLoaded);
        sceneEl.addEventListener("image-loaded", onObjectLoaded);
        sceneEl.addEventListener("pdf-loaded", onObjectLoaded);
        sceneEl.addEventListener("video-loaded", onObjectLoaded);
        sceneEl.addEventListener("model-error", onObjectLoaded);
      }
      sceneEl.addEventListener("environment-scene-loaded", onEnvironmentLoaded);
      sceneEl.addEventListener("didConnectToNetworkedScene", onNetworkConnected);
      sceneEl.addEventListener("didConnectToDialog", onDialogConnected);
    }

    return () => {
      if (!lazyLoadMedia) {
        sceneEl.removeEventListener("model-loading", onObjectLoading);
        sceneEl.removeEventListener("image-loading", onObjectLoading);
        sceneEl.removeEventListener("pdf-loading", onObjectLoading);
        sceneEl.removeEventListener("video-loading", onObjectLoading);
        sceneEl.removeEventListener("model-loaded", onObjectLoaded);
        sceneEl.removeEventListener("image-loaded", onObjectLoaded);
        sceneEl.removeEventListener("pdf-loaded", onObjectLoaded);
        sceneEl.removeEventListener("video-loaded", onObjectLoaded);
        sceneEl.removeEventListener("model-error", onObjectLoaded);
      }
      sceneEl.removeEventListener("environment-scene-loaded", onEnvironmentLoaded);
      sceneEl.removeEventListener("didConnectToNetworkedScene", onNetworkConnected);
      sceneEl.removeEventListener("didConnectToDialog", onDialogConnected);
    };
  }, [
    sceneEl,
    done,
    onObjectLoaded,
    onObjectLoading,
    onEnvironmentLoaded,
    onNetworkConnected,
    onDialogConnected,
    lazyLoadMedia
  ]);

  const intl = useIntl();

  const message = intl.formatMessage(messages[messageKey], {
    // Never show a loaded count that's greater than the object count
    loadedCount: Math.min(loadedCount, objectCount),
    objectCount
  });

  useEffect(() => {
    if (done) {
      // The loaded state on the scene signifies that the loading screen is no longer visible,
      // the initial scene was loaded, and the network connection is established.
      sceneEl.addState("loaded");
    }
  }, [sceneEl, done]);

  // Ensure timeout is cleared on unmount.
  useEffect(() => {
    () => {
      clearTimeout(loadingTimeoutRef.current);
    };
  }, []);

  return { loading: !done, message };
}
