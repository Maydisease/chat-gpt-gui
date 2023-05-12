// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use std::path::PathBuf;
mod tools_mod;
extern crate machine_uid;
use std::process::Command;
use std::time::Duration;
use tauri::async_runtime::spawn;
use tauri::Context;
use tauri::Window;
use tauri::{AppHandle, Manager};
use tauri_plugin_aptabase::EventTracker;
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

#[tauri::command]
fn init_process(window: Window) {
    window.show().unwrap();
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_aptabase::Builder::new("A-EU-0266735642").build()) // 👈 this is where you enter your App Key
        .invoke_handler(tauri::generate_handler![
            init_process,
            get_machine_uid,
            http_encrypt
        ])
        .setup(|app| {
            let mut window = app.get_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn get_machine_uid() -> String {
    let mut machine_uid: String = machine_uid::get().unwrap();
    machine_uid = format!("{:?}", md5::compute(&machine_uid));
    machine_uid = format!("{}", &machine_uid[0..8]);
    machine_uid
}

#[tauri::command]
fn http_encrypt(body: &str, handle: tauri::AppHandle) -> String {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("lib/libtools.dylib")
        .expect("failed to resolve resource");
    let path_str = resource_path.as_path().to_str().unwrap();
    tools_mod::tools::http_encrypt(body, path_str)
}
