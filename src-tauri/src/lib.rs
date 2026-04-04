mod commands;

use tauri::{Emitter, Manager};

pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_single_instance::init(|app, args, _cwd| {
                // When a second instance is launched (e.g., double-click on .md file),
                // forward the file path to the existing window
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.set_focus();
                    let _ = window.emit("open-file", args.get(1).cloned().unwrap_or_default());
                }
            }),
        )
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            commands::read_markdown_file,
            commands::get_startup_file_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
