import { memo, PropsWithChildren, useId, useMemo } from "react";
import { ContentCardProps } from "./ContentCard.types";
import { isEmpty, isUndefined } from "lodash";
import "./contentCard.scss";

/**
 * This component wraps its content into a card like container.
 */
export const ContentCard = memo(
  ({ children, title }: PropsWithChildren<ContentCardProps>) => {
    const id = useId();

    const showTitle = useMemo(
      () => !isUndefined(title) && !isEmpty(title),
      [title]
    );

    return (
      <div id={id} className="content__card__container">
        {showTitle && <h4>{title}</h4>}
        <div className="content__card__body">{children}</div>
      </div>
    );
  }
);
