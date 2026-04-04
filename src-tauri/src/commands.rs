#[tauri::command]
pub fn read_markdown_file(path: String) -> Result<String, String> {
    let file_path = std::path::Path::new(&path);
    match file_path.extension().and_then(|e| e.to_str()) {
        Some(ext) if ext.eq_ignore_ascii_case("md") || ext.eq_ignore_ascii_case("markdown") => {},
        _ => return Err("Not a markdown file".to_string()),
    }
    std::fs::read_to_string(&path).map_err(|e| format!("Failed to read file: {}", e))
}

#[tauri::command]
pub fn get_startup_file_path() -> Option<String> {
    let args: Vec<String> = std::env::args().collect();
    if args.len() > 1 {
        let path = &args[1];
        let lower = path.to_lowercase();
        if lower.ends_with(".md") || lower.ends_with(".markdown") {
            return Some(path.clone());
        }
    }
    None
}
