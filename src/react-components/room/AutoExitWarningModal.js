import React from "react";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";
import PropTypes from "prop-types";
import { Modal } from "../modal/Modal";
import { CancelButton } from "../input/Button";
import { Column } from "../layout/Column";

export const AutoExitReason = {
  concurrentSession: "concurrentSession",
  idle: "idle"
};

const messages = defineMessages({
  [AutoExitReason.concurrentSession]: {
    id: "auto-exit-warning-modal.reason.concurrent-session",
    defaultMessage: "Вы начали другую сессию."
  },
  [AutoExitReason.idle]: {
    id: "auto-exit-warning-modal.reason.idle",
    defaultMessage: "Вы слишком долго бездействовали."
  }
});

export function AutoExitWarningModal({ onCancel, reason, secondsRemaining }) {
  const intl = useIntl();

  return (
    <Modal title="Warning">
      <Column padding center>
        <b>
          <FormattedMessage
            id="auto-exit-warning-modal.message"
            defaultMessage="Автозавершение сеанса через {secondsRemaining} секунд"
            values={{ secondsRemaining }}
          />
        </b>
        <p>{intl.formatMessage(messages[reason])}</p>
        <CancelButton onClick={onCancel} />
      </Column>
    </Modal>
  );
}

AutoExitWarningModal.propTypes = {
  reason: PropTypes.string.isRequired,
  secondsRemaining: PropTypes.number.isRequired,
  onCancel: PropTypes.func
};
