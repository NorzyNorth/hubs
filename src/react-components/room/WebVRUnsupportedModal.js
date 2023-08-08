import React from "react";
import PropTypes from "prop-types";
import { Modal } from "../modal/Modal";
import { CloseButton } from "../input/CloseButton";
import { Button } from "../input/Button";
import { Column } from "../layout/Column";
import { FormattedMessage } from "react-intl";

export function WebVRUnsupportedModal({ onClose }) {
  return (
    <Modal
      title={<FormattedMessage id="webvr-unsupported-modal.title" defaultMessage="Вход в VR" />}
      beforeTitle={<CloseButton onClick={onClose} />}
    >
      <Column padding center>
        <p>
          <FormattedMessage
            id="webvr-unsupported-modal.message"
            defaultMessage="WebVR не поддерживается в этом браузере, для входа с помощью Oculus или SteamVR используйте Firefox."
          />
        </p>
        <Button
          as="a"
          preset="accent2"
          href="https://www.mozilla.org/firefox/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <span>
            <FormattedMessage id="webvr-unsupported-modal.download-firefox-button" defaultMessage="Скачать Firefox" />
          </span>
        </Button>
        <p>
          <small>
            <FormattedMessage
              id="webvr-unsupported-modal.webvr-rocks-link"
              defaultMessage="Список браузеров с экспериментальной поддержкой VR можно найти на сайте <a>WebVR Rocks</a>."
              values={{
                // eslint-disable-next-line react/display-name
                a: chunks => (
                  <a href="https://webvr.rocks" target="_blank" rel="noopener noreferrer">
                    {chunks}
                  </a>
                )
              }}
            />
          </small>
        </p>
      </Column>
    </Modal>
  );
}

WebVRUnsupportedModal.propTypes = {
  onClose: PropTypes.func
};
