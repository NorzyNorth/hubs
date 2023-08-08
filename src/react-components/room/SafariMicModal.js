import React from "react";
import { Modal } from "../modal/Modal";
import { Button } from "../input/Button";
import { Column } from "../layout/Column";
import { FormattedMessage } from "react-intl";

export function SafariMicModal() {
  return (
    <Modal title={<FormattedMessage id="safari-mic-modal.title" defaultMessage="Требуется доступ к микрофону" />}>
      <Column center padding>
        <FormattedMessage
          id="safari-mic-modal.message"
          defaultMessage="<p>Hubs требует разрешения на использование микрофона в Safari.</p><p>Пожалуйста, перезагрузитесь и разрешите доступ к микрофону для продолжения работы.</p>"
          values={{
            // eslint-disable-next-line react/display-name
            p: chunks => <p>{chunks}</p>
          }}
        />
        <Button preset="accept" onClick={() => location.reload()}>
          <FormattedMessage id="safari-mic-modal.reload-button" defaultMessage="Перезагрузить" />
        </Button>
      </Column>
    </Modal>
  );
}
