import {
  afterPatch,
  findInReactTree,
  RoutePatch,
  wrapReactType,
} from "decky-frontend-lib";
import { ReactElement } from "react";
import { Backend } from "../app/backend";

export const patchHome = (backend: Backend): RoutePatch => {
  //* This only runs 1 time, which is perfect
  return backend.serverAPI.routerHook.addPatch(
    "/library/home",
    (props: { path: string; children: ReactElement }) => {
      afterPatch(
        props.children,
        "type",
        (_: Record<string, unknown>[], ret?: any) => {
          wrapReactType(ret);

          afterPatch(
            ret.type,
            "type",
            (_: Record<string, unknown>[], ret2?: any) => {
              const recents = findInReactTree(
                ret2,
                (x) =>
                  x?.props &&
                  "autoFocus" in x.props &&
                  "showBackground" in x.props
              );

              afterPatch(
                recents.type,
                "type",
                (_: Record<string, unknown>[], ret3?: any) => {
                  if (backend.GetCache()) {
                    ret3 = backend.GetCache();
                    return ret3;
                  }

                  const p = findInReactTree(
                    ret3,
                    (x) => x?.props?.games && x?.props.onItemFocus
                  );

                  ret3.props.children[1].props.children[0].props.children[0].props.children =
                    backend.GetCollectionName();

                  p.props.games = backend.GetGames();

                  afterPatch(
                    p,
                    "type",
                    (_: Record<string, unknown>[], ret4?: any) => {
                      backend.SetCache(ret3);
                      return ret4;
                    }
                  );
                  return ret3;
                }
              );

              return ret2;
            }
          );
          return ret;
        }
      );
      return props;
    }
  );
};
