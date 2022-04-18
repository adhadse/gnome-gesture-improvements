/* eslint-disable @typescript-eslint/no-unused-vars */

declare const ARGV: string[];
imports.gi.versions['Gtk'] = '4.0';

import Gio from '@gi-types/gio2';
import GLib from '@gi-types/glib2';
import { registerClass } from '@gi-types/gobject2';
// import Gtk from '@gi-types/gtk4';
import Adw from '@gi-types/adw1';

/** Add parent directory of file in searchPath to be able to import files */
function InsertIntoImportsPath() {
	const dirname = Gio.file_new_for_path(imports.system.programPath ?? imports.system.programInvocationName).get_parent()?.get_path();
	if (dirname) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(imports as any).searchPath.unshift(dirname);
	}
}
InsertIntoImportsPath();

import { buildPrefsWidget } from './common/prefs';

/** Read metadata of extension file */
function GetExtensionObj(): ExtensionMeta {
	const [_, buffer] = Gio.file_new_for_path('./metadata.json').load_contents(null);
	const metadata = imports.byteArray.toString(buffer);
	return JSON.parse(metadata);
}

/** Using this function to get all global options into single object */
function GetProgramOptions() {
	const extension = GetExtensionObj();
	const currentDir = GLib.get_current_dir();
	const extensionId = extension['uuid'];
	let schema: string;
	if (extension['settings-schema'] === undefined) {
		throw new Error('Schema not provided in metadata');
	}
	else
		schema = extension['settings-schema'];
	return {
		extensionId,
		/** updated ui file */
		uiDir: `${currentDir}/extension/ui`,
		/** using same schema used by extension to ensure, we can test preference */
		schemaDir: Gio.file_new_for_path(`${GLib.get_home_dir()}/.local/share/gnome-shell/extensions/${extensionId}/schemas`),
		schema,
	};
}


const programOptions = GetProgramOptions();

/** Get extension settings */
function getSettings() {
	const GioSSS = Gio.SettingsSchemaSource;

	/// let it crash,...
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	let schemaSource = GioSSS.get_default()!;
	if (programOptions.schemaDir.query_exists(null)) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		schemaSource = GioSSS.new_from_directory(programOptions.schemaDir.get_path()!, schemaSource, false);
	} else {
		throw new Error(`Schema Directory '${programOptions.schemaDir.get_path()}' could not be found. Please check your installation`);
	}

	const schemaObj = schemaSource.lookup(programOptions.schema, true);
	if (!schemaObj)
		throw new Error(`Schema ${programOptions.schema} could not be found for extension ${programOptions.extensionId}. Please check your installation`);

	return new Gio.Settings({ settings_schema: schemaObj });
}

const ExampleApp = registerClass(
	class ExampleApp extends Adw.Application {
		prefsWindow!: Adw.PreferencesWindow;
		settings!: Gio.Settings;

		vfunc_startup() {
			super.vfunc_startup();
			this.prefsWindow = new Adw.PreferencesWindow({ application: this });
			this.settings = getSettings();
			buildPrefsWidget(this.prefsWindow, this.settings, programOptions.uiDir);
		}

		vfunc_activate() {
			super.vfunc_activate();
			this.prefsWindow.present();
		}
	},
);

const app = new ExampleApp();
app.run([]);
log('App quit');