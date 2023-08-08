import React from "react";
import { LoadingScreen } from "./LoadingScreen";

export default {
  title: "Room/LoadingScreen",
  parameters: {
    layout: "fullscreen"
  }
};

const infoMessages = [
  { heading: "Подсказка:", message: "Нажимайте клавиши Q и E для поворота влево и вправо." },
  {
    heading: "Что нового?",
    message: (
      <>
        Теперь в настройках можно установить локаль по умолчанию.{" "}
        <a href="#" target="_blank">
          Read More
        </a>
      </>
    )
  }
];

export const Base = () => <LoadingScreen message="Loading objects 2/14" infoMessages={infoMessages} />;
