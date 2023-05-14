// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use machine_uid;
use std::env;
use std::process::Command;
use std::time::Instant;
use tauri::Manager;
use tauri::Window;
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

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
            let window = app.get_window("main").unwrap();

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
    let start = Instant::now();
    let mut encrypt_result = String::from("");
    let bin_path = handle
        .path_resolver()
        .resolve_resource("lib/http_encrypt")
        .expect("failed to resolve resource");
    let bin_path_str = bin_path.as_path().to_str().unwrap();

    let output = Command::new(bin_path_str)
        .args(&["--message", body, "--type", "1"])
        .output()
        .expect("failed to execute process");

    if output.status.success() {
        let result = String::from_utf8(output.stdout).unwrap();
        encrypt_result.push_str(&result);
    } else {
        let error = String::from_utf8(output.stderr).unwrap();
        eprintln!("{}", error);
    }
    let end = Instant::now();
    let elapsed = end - start; // 计算时间差

    println!("http_encrypt used time: {:?}", elapsed);

    encrypt_result
}
