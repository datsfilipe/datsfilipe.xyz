use datsfilipe_xyz::ThreadPool;
use std::{
    fs,
    io::{BufReader, prelude::*},
    net::{TcpListener, TcpStream},
};

fn main() {
    let listener = TcpListener::bind("127.0.0.1:6969").unwrap();
    let pool = ThreadPool::new(4);

    for stream in listener.incoming() {
        let stream = stream.unwrap();

        pool.execute(|| {
            handle_conn(stream);
        });
    }

    println!("Shutting down.");
}

fn handle_conn(mut stream: TcpStream) {
    let buf_reader = BufReader::new(&stream);
    let http_request: Vec<_> = buf_reader
        .lines()
        .map(|result| result.unwrap())
        .take_while(|line| !line.is_empty())
        .collect();

    let request_line: Vec<_> = http_request[0].split(" ").collect();
    if request_line[1] == "/" && request_line[2] == "HTTP/1.1" {
        println!("Server responding to request for: {path:?}; using {protocol:?} protocol.", path = request_line[1], protocol = request_line[2]);

        let status_line = "HTTP/1.1 200 OK";
        let contents = fs::read_to_string("pages/home.html").unwrap();
        let length = contents.len();

        let response = format!("{status_line}\r\nContent-Length: {length}\r\n\r\n{contents}");
        stream.write_all(response.as_bytes()).unwrap();
    } else {
        let response = "HTTP/1.1 404 NOT FOUND";
        stream.write_all(response.as_bytes()).unwrap();
    }
}
