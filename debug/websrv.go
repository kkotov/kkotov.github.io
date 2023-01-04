// A tiny web server to alliviate local AJAX development
package main

import (
    "os"
    "log"
    "fmt"
    "flag"
    "net/http"
    "path/filepath"
    "github.com/gorilla/mux"
)

// input options
var (
    port_opt = flag.String("listen-port",":10000", "Port to listen on for REST-over-HTTP requests.")
    dir_opt  = flag.String("dir",        "./", "Directory to serve files from")
)

type SpaHandler struct {}

func (SpaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

    // prepend the path with the path to the static directory
    path := filepath.Join(*dir_opt, r.URL.Path)

    // check whether a file exists at the given path
    _, err := os.Stat(path)
    if os.IsNotExist(err) {
        // file does not exist, serve index.html
        http.Error(w, err.Error(), http.StatusBadRequest)
        //http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
        return
    } else
    if err != nil {
        // if we got an error (that wasn't that the file doesn't exist) stating the
        // file, return a 500 internal server error and stop
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // otherwise, use http.FileServer to serve the static dir
    http.FileServer(http.Dir(*dir_opt)).ServeHTTP(w, r)
}


func handleRequests() {
    // creates a new instance of a mux router
    myRouter := mux.NewRouter().StrictSlash(true)
    spa := SpaHandler{}
    myRouter.PathPrefix("/").Handler(http.StripPrefix("/",spa))
    // finally, instead of passing in nil, we want
    // to pass in our newly created router as the second
    // argument
    log.Fatal(http.ListenAndServe(*port_opt, myRouter))
}

func main() {
    flag.Parse()
    fmt.Printf("Flags: port_opt=%v , dir_opt=%v\n", *port_opt, *dir_opt)
    handleRequests()
}
