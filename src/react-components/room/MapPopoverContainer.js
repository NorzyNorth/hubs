import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ReactComponent as PenIcon } from "../icons/Pen.svg";
import { ReactComponent as CameraIcon } from "../icons/Camera.svg";
import { ReactComponent as GIFIcon } from "../icons/GIF.svg";
import { ReactComponent as ObjectIcon } from "../icons/Object.svg";
import { ReactComponent as AvatarIcon } from "../icons/Avatar.svg";
import { ReactComponent as SceneIcon } from "../icons/Scene.svg";
import { ReactComponent as UploadIcon } from "../icons/Upload.svg";
import { PlacePopoverButton } from "./PlacePopover";
import { ObjectUrlModalContainer } from "./ObjectUrlModalContainer";
import configs from "../../utils/configs";
import { FormattedMessage } from "react-intl";
import { anyEntityWith } from "../../utils/bit-utils";
import { MyCameraTool } from "../../bit-components";
import { MapPopoverButton } from "./MapPopover";

export function MapPopoverContainer({ scene, mediaSearchStore, showNonHistoriedDialog, hubChannel }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    function updateItems() {
      const hasActiveCamera = !!anyEntityWith(APP.world, MyCameraTool);
      const hasActivePen = !!scene.systems["pen-tools"].getMyPen();

      let nextItems = [
        hubChannel.can("spawn_drawing") && {
          id: "pen1",
          icon: PenIcon,
          color: "pen",
          label: <FormattedMessage id="place-popover.item-type.pen" defaultMessage="Ручка" />,
          onSelect: () => scene.emit("penButtonPressed"),
          selected: hasActivePen
        },
        hubChannel.can("spawn_camera") && {
          id: "camera1",
          icon: CameraIcon,
          color: "camera",
          label: <FormattedMessage id="place-popover.item-type.camera" defaultMessage="Камера" />,
          onSelect: () => scene.emit("action_toggle_camera"),
          selected: hasActiveCamera
        }
      ];

      if (hubChannel.can("spawn_and_move_media")) {
        nextItems = [
          ...nextItems,
          // TODO: Create text/link dialog
          // { id: "text", icon: TextIcon, color: "blue", label: "Text" },
          // { id: "link", icon: LinkIcon, color: "blue", label: "Link" },
          {
            id: "avatar1",
            icon: AvatarIcon,
            color: "avatar",
            label: <FormattedMessage id="place-popover.item-type.avatar" defaultMessage="Аватар" />,
            onSelect: () => mediaSearchStore.sourceNavigate("avatars")
          },
          {
            id: "scene1",
            icon: SceneIcon,
            color: "scene",
            label: <FormattedMessage id="place-popover.item-type.scene" defaultMessage="Сцена" />,
            onSelect: () => mediaSearchStore.sourceNavigate("scenes")
          },
          {
            id: "upload1",
            icon: UploadIcon,
            color: "upload",
            label: <FormattedMessage id="place-popover.item-type.upload" defaultMessage="Загрузить" />,
            onSelect: () => showNonHistoriedDialog(ObjectUrlModalContainer, { scene })
          }
        ];
      }

      setItems(nextItems);
    }

    hubChannel.addEventListener("permissions_updated", updateItems);

    updateItems();

    function onSceneStateChange(event) {
      if (event.detail === "camera" || event.detail === "pen") {
        updateItems();
      }
    }

    scene.addEventListener("stateadded", onSceneStateChange);
    scene.addEventListener("stateremoved", onSceneStateChange);

    return () => {
      hubChannel.removeEventListener("permissions_updated", updateItems);
      scene.removeEventListener("stateadded", onSceneStateChange);
      scene.removeEventListener("stateremoved", onSceneStateChange);
    };
  }, [hubChannel, mediaSearchStore, showNonHistoriedDialog, scene]);

  return <MapPopoverButton items={items} />;
}

MapPopoverContainer.propTypes = {
  hubChannel: PropTypes.object.isRequired,
  scene: PropTypes.object.isRequired,
  mediaSearchStore: PropTypes.object.isRequired,
  showNonHistoriedDialog: PropTypes.func.isRequired
};
