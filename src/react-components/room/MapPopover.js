import React from "react";
import PropTypes from "prop-types";
import { Popover } from "../popover/Popover";
import { ToolbarButton } from "../input/ToolbarButton";
import { ReactComponent as MapIcon } from "../icons/Map.svg";
import { defineMessage, useIntl } from "react-intl";
import { ToolTip } from "@mozilla/lilypad-ui";
import { usePublicRooms } from "../home/usePublicRooms";
import { MediaGrid } from "../room/MediaGrid";
import { MediaTile } from "../room/MediaTiles";
import { scaledThumbnailUrlFor } from "../../utils/media-url-utils";
import { Column } from "../layout/Column";

const mapTooltipDescription = defineMessage({
  id: "share-tooltip.description",
  defaultMessage: "ЖОСКА ПОДРОЧИТЬ"
});

const mapPopoverTitle = defineMessage({
  id: "share-popover.title",
  defaultMessage: "ЖОСКА ПОДРОЧИТЬ"
});

export function MapPopoverButton({ items }) {
  const { results: publicRooms } = usePublicRooms();
  const sortedPublicRooms = Array.from(publicRooms).sort((a, b) => b.member_count - a.member_count);

  const intl = useIntl();
  const title = intl.formatMessage(mapPopoverTitle);
  const description = intl.formatMessage(mapTooltipDescription);

  const filteredItems = items.filter(item => !!item);

  // The button is removed if you can't share anything.
  if (filteredItems.length === 0) {
    return null;
  }

  const activeItem = filteredItems.find(item => item.active);

  // If there's one item to share (your smartphone camera), or an item is active (recording), then only show that button.
  if (filteredItems.length === 1 || activeItem) {
    const item = filteredItems[0];
    const Icon = item.icon;
    return (
      <ToolbarButton
        icon={<Icon />}
        onClick={() => {
          if (item.onSelect) {
            item.onSelect(item);
          }
        }}
        label={title}
        preset="map"
        statusColor={activeItem && "recording"}
      />
    );
  }

  return (
    <Popover
      title={title}
      content={props => (
        <Column grow padding>
          <MediaGrid center>
            {sortedPublicRooms.map(room => {
              return (
                <MediaTile
                  key={room.id}
                  entry={room}
                  processThumbnailUrl={(entry, width, height) =>
                    scaledThumbnailUrlFor(entry.images.preview.url, width, height)
                  }
                />
              );
            })}
          </MediaGrid>
        </Column>
      )}
      placement="top"
      offsetDistance={28}
      disableFullscreen
    >
      {({ togglePopover, popoverVisible, triggerRef }) => (
        <ToolTip description={description}>
          <ToolbarButton
            ref={triggerRef}
            icon={<MapIcon />}
            selected={popoverVisible}
            onClick={togglePopover}
            label={title}
            preset="map"
          />
        </ToolTip>
      )}
    </Popover>
  );
}

MapPopoverButton.propTypes = {
  items: PropTypes.array.isRequired
};
