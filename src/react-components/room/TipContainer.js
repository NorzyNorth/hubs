import React, { useCallback, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { Tip } from "./Tip";
import { ToastTip } from "./ToastTip";
import { useEffect } from "react";
import { discordBridgesForPresences, hasEmbedPresences } from "../../utils/phoenix-utils";
import { Tooltip } from "./Tooltip";

const isEndTooltipStep = step =>
  ["tips.desktop.end", "tips.mobile.end", "tips.desktop.menu", "tips.mobile.menu"].includes(step);

function OkDismissLabel() {
  return <FormattedMessage id="tips.dismiss.ok" defaultMessage="Ок" />;
}

export function FullscreenTip(props) {
  return (
    <Tip {...props} dismissLabel={<OkDismissLabel />}>
      <FormattedMessage
        id="tips.fullscreen"
        defaultMessage="Переход в полноэкранный режим. Нажмите Escape для отображения пользовательского интерфейса."
      />
    </Tip>
  );
}

export function RecordModeTip() {
  return (
    <ToastTip>
      <FormattedMessage
        id="record-mode-enabled-tip"
        defaultMessage="Режим записи включен, нажмите 'B' для выключения"
      />
    </ToastTip>
  );
}

export function TipContainer({ inLobby, inRoom, isStreaming, isEmbedded, scene, store, hubId, presences }) {
  const [lobbyTipDismissed, setLobbyTipDismissed] = useState(false);
  const [broadcastTipDismissed, setBroadcastTipDismissed] = useState(() =>
    store.state.confirmedBroadcastedRooms.includes(hubId)
  );
  const [streamingTipDismissed, setStreamingTipDismissed] = useState(false);
  const [embeddedTipDismissed, setEmbeddedTipDismissed] = useState(false);
  const [onboardingTipId, setOnboardingTipId] = useState(null);
  const timeoutRef = useRef(null);

  const onSkipOnboarding = useCallback(() => {
    scene.systems.tips.skipTips();
  }, [scene]);

  const onNextTip = useCallback(() => {
    scene.systems.tips.nextTip();
  }, [scene]);

  const onPrevTip = useCallback(() => {
    scene.systems.tips.prevTip();
  }, [scene]);

  useEffect(() => {
    if (isEndTooltipStep(onboardingTipId)) {
      timeoutRef.current = setTimeout(() => {
        scene.systems.tips.nextTip();
      }, 2500);
    }
  }, [scene, timeoutRef, onboardingTipId]);

  useEffect(() => {
    function onSceneTipChanged({ detail: tipId }) {
      setOnboardingTipId(null);
      setOnboardingTipId(tipId);
    }

    scene.addEventListener("tip-changed", onSceneTipChanged);

    setOnboardingTipId(scene.systems.tips.activeTip);

    return () => {
      scene.removeEventListener("tip-changed", onSceneTipChanged);
      clearTimeout(timeoutRef.current);
    };
  }, [scene]);

  const discordBridges = presences ? discordBridgesForPresences(presences) : [];
  const isBroadcasting = discordBridges.length > 0;

  if (inLobby) {
    if (lobbyTipDismissed) {
      return null;
    }

    return (
      <Tip onDismiss={() => setLobbyTipDismissed(true)} dismissLabel={<OkDismissLabel />}>
        <FormattedMessage id="tips.lobby" defaultMessage="Вы находитесь в лобби. Другие не видят и не слышат вас." />
      </Tip>
    );
  } else if (inRoom) {
    if (onboardingTipId) {
      return <Tooltip onPrev={onPrevTip} onNext={onNextTip} onDismiss={onSkipOnboarding} step={onboardingTipId} />;
    }

    if (isStreaming && !streamingTipDismissed) {
      return (
        <Tip onDismiss={() => setStreamingTipDismissed(true)} dismissLabel={<OkDismissLabel />}>
          <FormattedMessage
            id="tips.streaming"
            defaultMessage="Теперь вещание ведется в лобби. По окончании работы выйдите из режима стримера в меню Больше."
          />
        </Tip>
      );
    }

    if (isBroadcasting && !broadcastTipDismissed) {
      return (
        <Tip onDismiss={() => setBroadcastTipDismissed(true)} dismissLabel={<OkDismissLabel />}>
          <FormattedMessage
            id="tips.discord"
            defaultMessage="Чат в этой комнате переключается на {broadcastTarget} в Discord."
            values={{ broadcastTarget: discordBridges.map(channelName => "#" + channelName).join(", ") }}
          />
        </Tip>
      );
    }

    if ((isEmbedded || hasEmbedPresences(presences)) && !embeddedTipDismissed) {
      return (
        <Tip onDismiss={() => setEmbeddedTipDismissed(true)} dismissLabel={<OkDismissLabel />}>
          <FormattedMessage
            id="tips.embedded"
            defaultMessage="Эта комната является встроенной, поэтому она может быть видна посетителям других сайтов."
          />
        </Tip>
      );
    }

    return null;
  }

  return null;
}

TipContainer.propTypes = {
  inLobby: PropTypes.bool,
  inRoom: PropTypes.bool,
  isStreaming: PropTypes.bool,
  isEmbedded: PropTypes.bool,
  scene: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  hubId: PropTypes.string,
  presences: PropTypes.object
};
