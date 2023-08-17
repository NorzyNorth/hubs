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

export function PlacePopoverContainer({ scene, mediaSearchStore, showNonHistoriedDialog, hubChannel }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    function updateItems() {
      const hasActiveCamera = !!anyEntityWith(APP.world, MyCameraTool);
      const hasActivePen = !!scene.systems["pen-tools"].getMyPen();

      let nextItems = [
        hubChannel.can("spawn_drawing") && {
          id: "pen",
          icon: PenIcon,
          color: "pen",
          label: <FormattedMessage id="place-popover.item-type.pen" defaultMessage="Ручка" />,
          onSelect: () => scene.emit("penButtonPressed"),
          selected: hasActivePen
        },
        hubChannel.can("spawn_camera") && {
          id: "camera",
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
          configs.integration("tenor") && {
            id: "gif",
            icon: GIFIcon,
            color: "gif",
            label: <FormattedMessage id="place-popover.item-type.gif" defaultMessage="GIF" />,
            onSelect: () => mediaSearchStore.sourceNavigate("gifs")
          },
          configs.integration("sketchfab") && {
            id: "model",
            icon: ObjectIcon,
            color: "3d",
            label: <FormattedMessage id="place-popover.item-type.model" defaultMessage="3D Модель" />,
            onSelect: () => mediaSearchStore.sourceNavigate("sketchfab")
          },
          {
            id: "avatar",
            icon: AvatarIcon,
            color: "avatar",
            label: <FormattedMessage id="place-popover.item-type.avatar" defaultMessage="Аватар" />,
            onSelect: () => mediaSearchStore.sourceNavigate("avatars")
          },
          {
            id: "scene",
            icon: SceneIcon,
            color: "scene",
            label: <FormattedMessage id="place-popover.item-type.scene" defaultMessage="Сцена" />,
            onSelect: () => mediaSearchStore.sourceNavigate("scenes")
          },
          {
            id: "upload",
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

  return <PlacePopoverButton items={items} />;
}

PlacePopoverContainer.propTypes = {
  hubChannel: PropTypes.object.isRequired,
  scene: PropTypes.object.isRequired,
  mediaSearchStore: PropTypes.object.isRequired,
  showNonHistoriedDialog: PropTypes.func.isRequired
};
