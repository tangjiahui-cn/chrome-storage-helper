/**
 * 监听message
 *
 * At 2023/12/29
 * By TangJiaHui
 */
import {ContentPlugin} from "@/model";
import LocalStoragePlugin from "@/content-plugin/localStorage";
import LocationPlugin from "@/content-plugin/location";
import SessionStorage from "@/content-plugin/sessionStorage";
import System from "@/content-plugin/system";

const contentPlugins = new ContentPlugin();
contentPlugins.use(LocalStoragePlugin);
contentPlugins.use(LocationPlugin)
contentPlugins.use(SessionStorage)
contentPlugins.use(System)

chrome?.runtime?.onMessage?.addListener((request, sender, sendResponse) => {
  contentPlugins.process(request.payload).then((data) => {
    sendResponse?.({
      success: true,
      data
    })
  })
})
