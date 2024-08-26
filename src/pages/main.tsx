import {
  Field,
  PanelSectionRow,
  Dropdown,
  SingleDropdownOption,
  DropdownOption,
  Toggle,
  PanelSection,
} from "decky-frontend-lib";
import { useEffect, useMemo, useState, VFC } from "react";
import { DEFAULTS, HomeMasterSettings } from "../app/settings";
import { useLocator } from "../components/locator";
import { Backend } from "../app/backend";

type Props = {
  backend: Backend;
};

export const Main: VFC<Props> = ({ backend }: Props) => {
  const { settings } = useLocator();
  let [current, setCurrent] = useState<HomeMasterSettings>(DEFAULTS);
  let [loaded, setLoaded] = useState<boolean>(false);

  let loadSettings = () => {
    setLoaded(false);
    settings.get().then((r) => {
      setCurrent(r);
      setLoaded(true);
    });
  };

  useEffect(() => {
    loadSettings();
  }, []);

  let updateSettings = async () => {
    backend.LoadSettings(current);
    await settings.save(current);
    loadSettings();
  };

  const collections = useMemo(() => {
    const mStrNameValues: DropdownOption[] = [];

    collectionStore.collectionsFromStorage.forEach((item) => {
      if (item.m_strId !== "hidden") {
        mStrNameValues.push({ data: item.m_strId, label: item.m_strName });
      }
    });

    mStrNameValues.push({ data: "", label: "Recent Games" });

    return mStrNameValues;
  }, []);

  return (
    <div>
      {loaded && (
        <PanelSection>
          <PanelSectionRow>
            <Dropdown
              // menuLabel={"Collection As Home"}
              rgOptions={collections}
              selectedOption={current.collectionData?.collectionId ?? undefined}
              strDefaultLabel={"Recent Games"}
              onChange={(elem: SingleDropdownOption) => {
                current.collectionData = {
                  collectionId: elem.data,
                  collectionName: elem.label?.toString() ?? "",
                };
                updateSettings();
              }}
            />
            <p style={{ padding: "0px 0px", fontSize: "12px" }}>
              Select which collection should be used as Home Page
            </p>
          </PanelSectionRow>
          <PanelSectionRow>
            <Field label="Show Collection Name">
              <Toggle
                value={!current.hideCollectionName}
                onChange={() => {
                  current.hideCollectionName = !current.hideCollectionName;
                  updateSettings();
                }}
              />
            </Field>
            <p style={{ padding: "0px 0px", fontSize: "12px" }}>
              To update Home page after making any changes either scroll around
              at Home screen or go to Library and back to Home page
            </p>
          </PanelSectionRow>
        </PanelSection>
      )}
    </div>
  );
};
