// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
extern crate machine_uid;
use ureq;
extern crate pulldown_cmark;
use comrak::{markdown_to_html, ComrakOptions};
use pulldown_cmark::{html, Parser};
use std::process::Command;
use std::time::Duration;
use tauri::async_runtime::spawn;
use tauri::Context;
use tauri::Window;
use tauri::{AppHandle, Manager};
use tauri_plugin_aptabase::EventTracker;
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("{}", markdown_to_html(name, &ComrakOptions::default()))
}

#[tauri::command]
fn init_process(window: Window) {
    window.show().unwrap();
}

#[tauri::command]
fn md_2_html(window: Window, markdown: &str) -> String {
    let mut html_buf = String::new();
    let parser = Parser::new(markdown);
    html::push_html(&mut html_buf, parser);
    html_buf
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_aptabase::Builder::new("A-EU-0266735642").build()) // 👈 this is where you enter your App Key
        .invoke_handler(tauri::generate_handler![
            greet,
            init_process,
            get_machine_uid,
            request,
            md_2_html
        ])
        .setup(|app| {
//             let mut pv_event = String::new();
//             pv_event.push_str("RPE_");
//             pv_event.push_str(get_machine_uid().as_str());
//
//             app.track_event(pv_event.as_str(), None);
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

// // 在异步运行时中执行任务
// spawn(async move {
// // 这里是异步代码
// println!("Hello from async code!");
// });
// }

#[tauri::command]
fn request(app_key: &str, content: &str) {}

fn send(app_key: &str, content: &str) -> String {
    let resp: String = ureq::post("https://deploy-service.f2e.hungrypanda.co/q")
        .set("content-type", "application/json")
        .send_json(ureq::json!({
            "appKey": app_key,
            "content": content
        }))
        .unwrap()
        .into_string()
        .unwrap();
    return resp;
}
