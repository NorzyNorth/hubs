import React from "react";
import PropTypes from "prop-types";
import { Modal } from "../modal/Modal";
import { CloseButton } from "../input/CloseButton";
import { TextInputField } from "../input/TextInputField";
import { useForm } from "react-hook-form";
import { Button } from "../input/Button";
import { FormattedMessage } from "react-intl";
import { Column } from "../layout/Column";

export function SceneUrlModal({ enableSpoke, editorName, onValidateUrl, onSubmit, onClose }) {
  const {
    isSubmitting,
    handleSubmit,
    register,
    formState: { errors }
  } = useForm();
  return (
    <Modal
      title={<FormattedMessage id="scene-url-modal.title" defaultMessage="URL пользовательской сцены" />}
      beforeTitle={<CloseButton onClick={onClose} />}
    >
      <Column as="form" padding center onSubmit={handleSubmit(onSubmit)}>
        <p>
          {enableSpoke ? (
            <FormattedMessage
              id="scene-url-modal.message-with-spoke"
              defaultMessage="Вставьте URL-адрес сцены {editorName} или URL-адрес <glblink>GLB</glblink>."
              values={{
                editorName: (
                  <a href="/spoke" target="_blank" rel="noopener noreferrer">
                    {editorName}
                  </a>
                ),
                // eslint-disable-next-line react/display-name
                glblink: chunks => (
                  <a href="https://en.wikipedia.org/wiki/GlTF#GLB" target="_blank" rel="noopener noreferrer">
                    {chunks}
                  </a>
                )
              }}
            />
          ) : (
            <FormattedMessage
              id="scene-url-modal.message"
              defaultMessage="Вставьте URL-адрес сцены или URL-адрес <glblink>GLB</glblink>."
              values={{
                // eslint-disable-next-line react/display-name
                glblink: chunks => (
                  <a href="https://en.wikipedia.org/wiki/GlTF#GLB" target="_blank" rel="noopener noreferrer">
                    {chunks}
                  </a>
                )
              }}
            />
          )}
        </p>
        <TextInputField
          label={<FormattedMessage id="scene-url-modal.url-input" defaultMessage="Scene URL" />}
          placeholder="https://example.com/scene.glb"
          type="url"
          {...register("url", { validate: onValidateUrl, required: true })}
          error={errors?.url?.message}
        />
        <Button type="submit" preset="accept" disabled={isSubmitting}>
          <FormattedMessage id="scene-url-modal.change-scene-button" defaultMessage="Смена сцены" />
        </Button>
        {enableSpoke && (
          <>
            <p>
              <FormattedMessage
                id="scene-url-modal.create-in-spoke"
                defaultMessage="Или создайте новую сцену, используя {editorName}."
                values={{ editorName }}
              />
            </p>
            <Button as="a" preset="primary" href="/spoke/new" target="_blank" rel="noopener noreferrer">
              <FormattedMessage
                id="scene-url-modal.new-spoke-project-button"
                defaultMessage="Запуск {editorName}"
                values={{ editorName }}
              />
            </Button>
          </>
        )}
      </Column>
    </Modal>
  );
}

SceneUrlModal.propTypes = {
  enableSpoke: PropTypes.bool,
  editorName: PropTypes.string,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  onValidateUrl: PropTypes.func.isRequired
};
