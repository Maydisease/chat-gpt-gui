pub mod tools {

    use crate::PathBuf;
    use libloading;
    use std::env;

    pub fn http_encrypt(body: &str, lib_path: &str) -> String {
        let mut new_result;

        unsafe {
            println!("lib_path:X1::: {:?}", lib_path);
            let lib = libloading::Library::new(lib_path).unwrap();
            println!("lib_path:X2::: {:?}", lib);
            let http_encrypt: libloading::Symbol<unsafe extern "C" fn(str: &str) -> String> =
                lib.get(b"http_encrypt").unwrap();
            println!("lib_path:X3::: {:?}", http_encrypt);
            let result = http_encrypt(&body.to_string());
            println!("lib_path:X4::: {:?}", result);
            new_result = result;
            println!("lib_path:X5::: {:?}", new_result);
        }

        new_result
    }
}
