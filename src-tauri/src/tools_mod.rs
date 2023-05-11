pub mod tools {

    use crate::PathBuf;
    use libloading;
    use std::env;

    pub fn http_encrypt(body: &str) -> String {
        let mut new_result;

        unsafe {
            let mut lib_path = PathBuf::from(env::current_dir().unwrap());
            lib_path.push("lib/libtools.dylib");
            let lib = libloading::Library::new(lib_path).unwrap();
            let http_encrypt: libloading::Symbol<unsafe extern "C" fn(str: &str) -> String> =
                lib.get(b"http_encrypt").unwrap();
            let result = http_encrypt(&body.to_string());
            new_result = result;
        }

        new_result
    }
}
