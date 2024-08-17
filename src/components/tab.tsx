import { Focusable, PanelSection, PanelSectionRow } from "decky-frontend-lib";

export const Tab: React.FC = ({ children }) => {
  return (
    <PanelSection>
      <PanelSectionRow>
        <Focusable style={{ minHeight: "100%", padding: "0px 0px" }}>
          {children}
        </Focusable>
      </PanelSectionRow>
    </PanelSection>
  );
};
