import React from "react";
import { useIntl, defineMessages, FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { Modal } from "../modal/Modal";
import { CloseButton } from "../input/CloseButton";
import { Button } from "../input/Button";
import { Column } from "../layout/Column";

export const LeaveReason = {
  leaveRoom: "leaveRoom",
  joinRoom: "joinRoom",
  createRoom: "createRoom"
};

const reasonMessages = defineMessages({
  [LeaveReason.leaveRoom]: {
    id: "leave-room-modal.leave-room.message",
    defaultMessage: "Вы уверены, что хотите выйти из комнаты?"
  },
  [LeaveReason.joinRoom]: {
    id: "leave-room-modal.join-room.message",
    defaultMessage: "При присоединении к новой комнате эта комната будет покинута. Вы уверены?"
  },
  [LeaveReason.createRoom]: {
    id: "leave-room-modal.create-room.message",
    defaultMessage: "При создании новой комнаты эта комната будет оставлена. Вы уверены?"
  }
});

const confirmationMessages = defineMessages({
  [LeaveReason.leaveRoom]: {
    id: "leave-room-modal.leave-room.confirm",
    defaultMessage: "Выйти из комнаты"
  },
  [LeaveReason.joinRoom]: {
    id: "leave-room-modal.join-room.confirm",
    defaultMessage: "Войти в комнату"
  },
  [LeaveReason.createRoom]: {
    id: "leave-room-modal.create-room.confirm",
    defaultMessage: "Выйти и создать комнату"
  }
});

export function LeaveRoomModal({ reason, destinationUrl, onClose }) {
  const intl = useIntl();

  return (
    <Modal
      title={<FormattedMessage id="leave-room-modal.title" defaultMessage="Выйти из комнаты" />}
      beforeTitle={<CloseButton onClick={onClose} />}
    >
      <Column padding center centerMd="both" grow>
        <p>{intl.formatMessage(reasonMessages[reason])}</p>
        <Button as="a" preset="cancel" href={destinationUrl} rel="noopener noreferrer">
          {intl.formatMessage(confirmationMessages[reason])}
        </Button>
      </Column>
    </Modal>
  );
}

LeaveRoomModal.propTypes = {
  reason: PropTypes.string,
  destinationUrl: PropTypes.string,
  onClose: PropTypes.func
};
