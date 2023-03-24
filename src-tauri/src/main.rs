// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

extern crate machine_uid;

use ureq;
use tauri::Window;
use comrak::{markdown_to_html, ComrakOptions};
use tauri::{AppHandle, Manager};
use std::process::Command;
use std::time::Duration;
use tauri::Context;
use tauri::async_runtime::spawn;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("{}", markdown_to_html(name, &ComrakOptions::default()))
}

#[tauri::command]
fn init_process(window: Window) {
    window.show().unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, init_process, get_network, request])
        .setup(|app| {
            // #[cfg(debug_assertions)] // only include this code on debug builds
            // {
                let window = app.get_window("main").unwrap();
            //     window.open_devtools();
            //     window.close_devtools();
            // }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn get_network() -> String {
    let id: String = machine_uid::get().unwrap();
    println!("{}", id);
    id
}

// // 在异步运行时中执行任务
// spawn(async move {
// // 这里是异步代码
// println!("Hello from async code!");
// });
// }

#[tauri::command]
fn request(app_key: &str, content: &str)  {
}


fn send(app_key: &str, content: &str) -> String {
    let resp: String = ureq::post("https://deploy-service.f2e.hungrypanda.co/q")
        .set("content-type", "application/json")
        .send_json(ureq::json!({
          "appKey": app_key,
          "content": content
      })).unwrap()
        .into_string().unwrap();
    return resp;
}
