// -*- indent-tabs-mode: nil; js-indent-level: 2 -*-

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// update menu items that rely on focus or on the current selection
function goUpdateGlobalEditMenuItems(force) {
  // Don't bother updating the edit commands if they aren't visible in any way
  // (i.e. the Edit menu isn't open, nor is the context menu open, nor have the
  // cut, copy, and paste buttons been added to the toolbars) for performance.
  // This only works in applications/on platforms that set the gEditUIVisible
  // flag, so we check to see if that flag is defined before using it.
  if (!force && (typeof gEditUIVisible != "undefined" && !gEditUIVisible))
    return;

  goUpdateCommand("cmd_undo");
  goUpdateCommand("cmd_redo");
  goUpdateCommand("cmd_cut");
  goUpdateCommand("cmd_copy");
  goUpdateCommand("cmd_paste");
  goUpdateCommand("cmd_selectAll");
  goUpdateCommand("cmd_delete");
  goUpdateCommand("cmd_switchTextDirection");
}

// update menu items that relate to undo/redo
function goUpdateUndoEditMenuItems() {
  goUpdateCommand("cmd_undo");
  goUpdateCommand("cmd_redo");
}

// update menu items that depend on clipboard contents
function goUpdatePasteMenuItems() {
  goUpdateCommand("cmd_paste");
}

// Support context menus on html textareas in the parent process:
window.addEventListener("contextmenu", (e) => {
  // Note that there's not a risk of e.target being XBL anonymous content for <textbox> (which manages
  // its own context menu), because e.target will be the XBL binding parent in that case.
  let needsContextMenu = e.target.ownerDocument == document &&
                         !e.defaultPrevented &&
                         e.target.localName == "textarea" &&
                         e.target.namespaceURI == "http://www.w3.org/1999/xhtml";

  if (!needsContextMenu) {
    return;
  }

  let popup = document.getElementById("textbox-contextmenu");
  if (!popup) {
    MozXULElement.insertFTLIfNeeded("toolkit/main-window/editmenu.ftl");
    document.documentElement.appendChild(MozXULElement.parseXULToFragment(`
      <menupopup id="textbox-contextmenu" class="textbox-contextmenu">
        <menuitem data-l10n-id="editmenu-undo" command="cmd_undo"></menuitem>
        <menuseparator></menuseparator>
        <menuitem data-l10n-id="editmenu-cut" command="cmd_cut"></menuitem>
        <menuitem data-l10n-id="editmenu-copy" command="cmd_copy"></menuitem>
        <menuitem data-l10n-id="editmenu-paste" command="cmd_paste"></menuitem>
        <menuitem data-l10n-id="editmenu-delete" command="cmd_delete"></menuitem>
        <menuseparator></menuseparator>
        <menuitem data-l10n-id="editmenu-select-all" command="cmd_selectAll"></menuitem>
      </menupopup>
    `));
    popup = document.documentElement.lastElementChild;
  }

  goUpdateGlobalEditMenuItems(true);
  popup.openPopupAtScreen(e.screenX, e.screenY, true);
});
