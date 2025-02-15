import React from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { Modal } from "../modal/Modal";
import { CloseButton } from "../input/CloseButton";
import { Button } from "../input/Button";
import { Column } from "../layout/Column";

export function TwitterOAuthModal({ appName, onConnect, onClose }) {
  return (
    <Modal
      title={<FormattedMessage id="twitter-oauth-modal.title" defaultMessage="Подключение к Twitter" />}
      beforeTitle={<CloseButton onClick={onClose} />}
    >
      <Column padding center centerMd="both" grow>
        <p>
          <FormattedMessage
            id="twitter-oauth-modal.message"
            defaultMessage="Подключение к Twitter для отправки твитов из {appName}."
            values={{ appName }}
          />
        </p>
        <Button preset="accent4" onClick={onConnect}>
          <FormattedMessage id="twitter-oauth-modal.connect-button" defaultMessage="Подключение к Twitter" />
        </Button>
      </Column>
    </Modal>
  );
}

TwitterOAuthModal.propTypes = {
  appName: PropTypes.string.isRequired,
  onConnect: PropTypes.func,
  onClose: PropTypes.func
};
