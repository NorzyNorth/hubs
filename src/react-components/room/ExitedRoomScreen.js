import React from "react";
import PropTypes from "prop-types";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { LoadingScreenLayout } from "../layout/LoadingScreenLayout";
import { Button } from "../input/Button";

export const ExitReason = {
  exited: "exited",
  closed: "closed",
  denied: "denied",
  disconnected: "disconnected",
  left: "left",
  full: "full",
  sceneError: "sceneError",
  connectError: "connectError",
  versionMismatch: "versionMismatch"
};

const messages = defineMessages({
  [ExitReason.exited]: {
    id: "exited-room-screen.reason.exited",
    defaultMessage: "Ваша сессия завершилась. Обновите браузер, чтобы начать новую сессию."
  },
  [ExitReason.closed]: {
    id: "exited-room-screen.reason.closed",
    defaultMessage: "Эта комната больше не доступна."
  },
  [ExitReason.denied]: {
    id: "exited-room-screen.reason.denied",
    defaultMessage: "Вы не можете присоединиться к этой комнате. Пожалуйста, запросите разрешение у создателя комнаты."
  },
  [ExitReason.disconnected]: {
    id: "exited-room-screen.reason.disconnected",
    defaultMessage: "Вы отключились от комнаты. Обновите страницу, чтобы попытаться снова подключиться."
  },
  [ExitReason.left]: {
    id: "exited-room-screen.reason.left",
    defaultMessage: "Вы вышли из комнаты."
  },
  [ExitReason.full]: {
    id: "exited-room-screen.reason.full",
    defaultMessage: "Этот номер заполнен, пожалуйста, повторите попытку позже."
  },
  [ExitReason.sceneError]: {
    id: "exited-room-screen.reason.scene-error",
    defaultMessage: "Сцена не смогла загрузиться."
  },
  [ExitReason.connectError]: {
    id: "exited-room-screen.reason.connect-error",
    defaultMessage: "Невозможно подключиться к этой комнате, повторите попытку позже."
  },
  [ExitReason.versionMismatch]: {
    id: "exited-room-screen.reason.version-mismatch",
    defaultMessage: "Развернутая вами версия пока недоступна. Ваш браузер обновится через 5 секунд."
  }
});

export function ExitedRoomScreen({ reason, showTerms, termsUrl, showSourceLink }) {
  const intl = useIntl();

  let subtitle = null;
  if (reason === ExitReason.closed) {
    const contactEmail = intl.formatMessage({ id: "contact-email" });

    subtitle = (
      <>
        <b>
          <FormattedMessage
            id="exited-room-screen.no-longer-available"
            defaultMessage="К сожалению, этот комната больше не доступна."
          />
        </b>
        {showTerms && (
          <p>
            <FormattedMessage
              id="exited-room-screen.closed-room-tos"
              defaultMessage="Комната может быть закрыта владельцем комнаты, или если мы получим сообщение о том, что она нарушает наши <toslink>Условия использования</toslink>."
              values={{
                // eslint-disable-next-line react/display-name
                toslink: chunks => (
                  <a target="_blank" rel="noreferrer noopener" href={termsUrl}>
                    {chunks}
                  </a>
                )
              }}
            />
          </p>
        )}
        <p>
          <FormattedMessage
            id="exited-room-screen.contact-us"
            defaultMessage="Если у Вас возникли вопросы, свяжитесь с нами по адресу {contactEmail}."
            values={{ contactEmail: <a href={`mailto:${contactEmail}`}>{contactEmail}</a> }}
          />
        </p>
        {showSourceLink && (
          <p>
            <FormattedMessage
              id="exited-room-screen.source-link"
              defaultMessage="Если вы хотите создать свой собственный сервер, исходный код Hubs доступен на сайте <a>GitHub</a>."
              values={{
                // eslint-disable-next-line react/display-name
                a: chunks => <a href="https://github.com/mozilla/hubs">{chunks}</a>
              }}
            />
          </p>
        )}

        <Button as="a" preset="accept" href="/">
          <FormattedMessage id="exited-room-screen.home-button" defaultMessage="Вернуться к началу" />
        </Button>
      </>
    );
  } else {
    const tcpUrl = new URL(document.location.toString());
    const tcpParams = new URLSearchParams(tcpUrl.search);
    tcpParams.set("force_tcp", true);
    tcpUrl.search = tcpParams.toString();

    subtitle = (
      <>
        <b>{intl.formatMessage(messages[reason])}</b>

        {reason === ExitReason.connectError && (
          <p>
            <FormattedMessage
              id="exited-room-screen.connect-tcp"
              defaultMessage="Можно попробовать <a>подключиться по TCP</a>, что может работать лучше в некоторых сетях."
              values={{
                // eslint-disable-next-line react/display-name
                a: chunks => <a href={tcpUrl.toString()}>{chunks}</a>
              }}
            />
          </p>
        )}
        {![ExitReason.left, ExitReason.disconnected, ExitReason.sceneError].includes(reason) && (
          <p>
            <FormattedMessage
              id="exited-room-screen.create-room"
              defaultMessage="Вы также можете <a>создать новую комнату</a>."
              values={{
                // eslint-disable-next-line react/display-name
                a: chunks => <a href="/">{chunks}</a>
              }}
            />
          </p>
        )}

        <Button as="a" preset="accept" href={window.location.href}>
          <FormattedMessage id="exited-room-screen.refresh-page-button" defaultMessage="Обновить страницу" />
        </Button>
      </>
    );
  }

  return <LoadingScreenLayout center={subtitle} />;
}

ExitedRoomScreen.propTypes = {
  reason: PropTypes.string.isRequired,
  showTerms: PropTypes.bool,
  termsUrl: PropTypes.string,
  showSourceLink: PropTypes.bool
};
