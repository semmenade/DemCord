/*
 * DemCord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

export const enum IpcEvents {
    INIT_FILE_WATCHERS = "DemCordInitFileWatchers",

    OPEN_QUICKCSS = "DemCordOpenQuickCss",
    GET_QUICK_CSS = "DemCordGetQuickCss",
    SET_QUICK_CSS = "DemCordSetQuickCss",
    QUICK_CSS_UPDATE = "DemCordQuickCssUpdate",

    GET_SETTINGS = "DemCordGetSettings",
    SET_SETTINGS = "DemCordSetSettings",

    GET_THEMES_LIST = "DemCordGetThemesList",
    GET_THEME_DATA = "DemCordGetThemeData",
    GET_THEME_SYSTEM_VALUES = "DemCordGetThemeSystemValues",
    THEME_UPDATE = "DemCordThemeUpdate",

    OPEN_EXTERNAL = "DemCordOpenExternal",
    OPEN_THEMES_FOLDER = "DemCordOpenThemesFolder",
    OPEN_SETTINGS_FOLDER = "DemCordOpenSettingsFolder",

    GET_UPDATES = "DemCordGetUpdates",
    GET_REPO = "DemCordGetRepo",
    UPDATE = "DemCordUpdate",
    BUILD = "DemCordBuild",

    OPEN_MONACO_EDITOR = "DemCordOpenMonacoEditor",
    GET_MONACO_THEME = "DemCordGetMonacoTheme",

    GET_PLUGIN_IPC_METHOD_MAP = "DemCordGetPluginIpcMethodMap",

    CSP_IS_DOMAIN_ALLOWED = "DemCordCspIsDomainAllowed",
    CSP_REMOVE_OVERRIDE = "DemCordCspRemoveOverride",
    CSP_REQUEST_ADD_OVERRIDE = "DemCordCspRequestAddOverride",

    GET_RENDERER_CSS = "DemCordGetRendererCss",
    RENDERER_CSS_UPDATE = "DemCordRendererCssUpdate",
    PRELOAD_GET_RENDERER_JS = "DemCordPreloadGetRendererJs",

    SUPPORTS_WINDOWS_MATERIAL = "DemCordSupportsWindowsMaterial",
}





