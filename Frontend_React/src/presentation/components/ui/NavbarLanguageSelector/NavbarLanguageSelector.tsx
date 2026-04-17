import { memo, useCallback, useEffect, useId, useMemo, useState } from "react";
import { PublicRounded } from "@mui/icons-material";
import { isNull } from "lodash";
import { Popover } from "@mui/material";
import {
  useLanguageAPI,
  useLanguageState,
} from "application/context/LanguageContextProvider";
import { SupportedLanguage } from "presentation/assets/lang";
import { FormattedMessage } from "react-intl";
import "./navbarLanguageSelector.scss";

/**
 * This component wraps the select for the internationalization languages.
 */
export const NavbarLanguageSelector = memo(() => {
  const { selectedLanguage } = useLanguageState();
  const { setEnglish, setRomanian } = useLanguageAPI();
  const elId = useId();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const onSelectorClicked = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => setAnchorEl(e.currentTarget),
    [setAnchorEl]
  );

  const handleClose = () => setAnchorEl(null);
  const open = useMemo(() => !isNull(anchorEl), [anchorEl]);
  const appLanguage = useMemo(() => selectedLanguage, [selectedLanguage]);

  const closeAfterChange = useCallback(() => {
    handleClose();
  }, [appLanguage]);

  useEffect(() => closeAfterChange(), [closeAfterChange]);

  return <div>
    <div className="navbar__language__selector" onClick={onSelectorClicked}>
      <PublicRounded className="navbar__language__selector__icon" />
      <span className="font-size-large">{appLanguage.toUpperCase()}</span>
    </div>
    <Popover
      id={elId}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <ul className="language__selector__items">
        <li
          onClick={setRomanian}
          className={`language__selector__item ${appLanguage === SupportedLanguage.RO ? "active" : ""
            }`.trim()}
        >
          <FormattedMessage id="nav.languageSelector.ro" />
        </li>
        <li
          onClick={setEnglish}
          className={`language__selector__item ${appLanguage === SupportedLanguage.EN ? "active" : ""
            }`.trim()}
        >
          <FormattedMessage id="nav.languageSelector.en" />
        </li>
      </ul>
    </Popover>
  </div>
});
