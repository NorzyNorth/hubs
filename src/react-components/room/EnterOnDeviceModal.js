import React from "react";
import PropTypes from "prop-types";
import { Modal } from "../modal/Modal";
import { Button } from "../input/Button";
import { ReactComponent as VRIcon } from "../icons/VR.svg";
import styles from "./EnterOnDeviceModal.scss";
import { BackButton } from "../input/BackButton";
import { Column } from "../layout/Column";
import { FormattedMessage, useIntl } from "react-intl";

export function EnterOnDeviceModal({
  className,
  shortUrl,
  loadingCode,
  code,
  headsetConnected,
  unsupportedBrowser,
  onEnterOnConnectedHeadset,
  onBack,
  ...rest
}) {
  const intl = useIntl();

  return (
    <Modal
      title={<FormattedMessage id="enter-on-device-modal.title" defaultMessage="Ввод на устройстве" />}
      beforeTitle={<BackButton onClick={onBack} />}
      className={className}
      {...rest}
    >
      <Column center={loadingCode ? "both" : true} padding grow>
        {loadingCode ? (
          <b>
            <FormattedMessage
              id="enter-on-device-modal.generating-code"
              defaultMessage="Генерация кода присоединения..."
            />
          </b>
        ) : (
          <>
            <b>
              <FormattedMessage
                id="enter-on-device-modal.heading"
                defaultMessage="Включение беспроводной гарнитуры / телефона"
              />
            </b>
            <small>
              <FormattedMessage
                id="enter-on-device-modal.short-url-directions"
                defaultMessage="В веб-браузере устройства перейдите на страницу:"
              />
            </small>
            <div className={styles.shortUrlContainer}>{shortUrl}</div>
            <small>
              <FormattedMessage
                id="enter-on-device-modal.code-directions"
                defaultMessage="Затем введите этот одноразовый код:"
              />
            </small>
            <div className={styles.codeContainer}>
              {code.split("").map((char, i) => (
                <div key={i} className={styles.codeLetter}>
                  {char}
                </div>
              ))}
            </div>
            <strong>
              <FormattedMessage
                id="enter-on-device-modal.data-transfer"
                defaultMessage="Ваша учетная запись и аватар будут перенесены на устройство."
              />
            </strong>
            <strong>
              <FormattedMessage
                id="enter-on-device-modal.keep-page-open"
                defaultMessage="Сохраните эту страницу открытой, чтобы использовать данный код."
              />
            </strong>
            {headsetConnected && (
              <>
                <hr
                  data-or-text={intl.formatMessage({ id: "enter-on-device-modal.divider-label", defaultMessage: "or" })}
                />
                <b>
                  <FormattedMessage
                    id="enter-on-device-modal.headset-connected-heading"
                    defaultMessage="Ввод на подключенной гарнитуре"
                  />
                </b>
                {unsupportedBrowser ? (
                  <>
                    <small>
                      <FormattedMessage
                        id="enter-on-device-modal.unsupported-browser"
                        defaultMessage="WebVR не поддерживается в этом браузере, для входа с помощью Oculus или SteamVR используйте Firefox."
                      />
                    </small>
                    <Button
                      as="a"
                      preset="accent2"
                      href="https://www.mozilla.org/firefox/"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <span>
                        <FormattedMessage
                          id="enter-on-device-modal.download-firefox-button"
                          defaultMessage="Download Firefox"
                        />
                      </span>
                    </Button>
                  </>
                ) : (
                  <>
                    <small>
                      <FormattedMessage
                        id="enter-on-device-modal.headset-connected-message"
                        defaultMessage="К этому устройству подключена гарнитура виртуальной реальности."
                      />
                    </small>
                    <Button preset="accent5" onClick={onEnterOnConnectedHeadset}>
                      <VRIcon />
                      <span>
                        <FormattedMessage id="enter-on-device-modal.enter-in-vr-button" defaultMessage="Вход в VR" />
                      </span>
                    </Button>
                  </>
                )}
              </>
            )}
          </>
        )}
      </Column>
    </Modal>
  );
}

EnterOnDeviceModal.propTypes = {
  className: PropTypes.string,
  shortUrl: PropTypes.string.isRequired,
  loadingCode: PropTypes.bool,
  code: PropTypes.string,
  headsetConnected: PropTypes.bool,
  unsupportedBrowser: PropTypes.bool,
  onEnterOnConnectedHeadset: PropTypes.func,
  onBack: PropTypes.func
};
