import {
  Field,
  PanelSectionRow,
  SidebarNavigation,
  Dropdown,
  SingleDropdownOption,
  DropdownOption,
  Toggle,
} from "decky-frontend-lib";
import { useEffect, useMemo, useState, VFC } from "react";
import { DEFAULTS, HomeMasterSettings } from "../app/settings";
import { useLocator } from "../components/locator";
import { Tab } from "../components/tab";
import { Backend } from "../app/backend";

type Props = {
  backend: Backend;
};

export const GeneralSettings: VFC<Props> = ({ backend }: Props) => {
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

    console.log("collections memo", mStrNameValues);

    return mStrNameValues;
  }, []);

  return (
    <div>
      {loaded && (
        <>
          <PanelSectionRow>
            <Field
              label="Home Collection"
              description="Select which collection will be used at Home page"
            >
              <Dropdown
                // menuLabel={"Collection As Home"}
                rgOptions={collections}
                selectedOption={
                  current.collectionData?.collectionId ?? undefined
                }
                strDefaultLabel={"Recent Games"}
                onChange={(elem: SingleDropdownOption) => {
                  current.collectionData = {
                    collectionId: elem.data,
                    collectionName: elem.label?.toString() ?? "",
                  };
                  updateSettings();
                }}
              />
            </Field>
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
          </PanelSectionRow>
        </>
      )}
    </div>
  );
};

export const SettingsPage: VFC<Props> = ({ backend }: Props) => {
  return (
    <SidebarNavigation
      pages={[
        {
          title: "General",
          content: (
            <Tab>
              <GeneralSettings backend={backend} />
            </Tab>
          ),
        },
      ]}
    />
  );
};
