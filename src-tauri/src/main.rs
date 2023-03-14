// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

extern crate machine_uid;
use tauri::Window;
use comrak::{markdown_to_html, ComrakOptions};
use tauri::{AppHandle, Manager};
use std::process::Command;
use std::time::Duration;
use tauri::Context;

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
    get_network();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, init_process, get_network])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn get_network() -> String {
    let id: String = machine_uid::get().unwrap();
    println!("{}", id);
    id
}
