const AppService = require("..");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const ROUTES = require("../../routes/routes");


class UploadService {

    static #config = AppService.config;

    static #uploadPath = "uploads/";
    static setUploadPath(path) {
        this.#uploadPath = path;
    }

    static #routePath = ROUTES.STORAGE_GET_FILE;
    static getRoutePath(filename) {
        return this.#routePath.split(":")[0] + filename;
    }


    static #mediasType = {
        video: ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv'],
        image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'],
        audio: ['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a'],
        document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
        runnable: ['exe', 'sh', 'bat', 'jar', 'apk', 'py'],
        archive: ['zip', 'rar', 'tar', 'iso', '7z'],
        none: [""]
    }


    static #mediasPath = {
        video: "videos/",
        image: "images/",
        audio: "audios/",
        document: "documents/",
        runnable: "runnables/",
        archive: "archives/",
        none: "nones/",
    }


    static #fileExt(file) {
        const split = file.originalname.split(".");
        return split.length < 2 ? "" : split[split.length - 1]
    }

    static #fileFolder(file) {
        let folder = "none";
        for (let key of Object.keys(this.#mediasType)) {
            if (this.#mediasType[key].includes(this.#fileExt(file))) {
                folder = key;
                break;
            }
        }
        const up = this.#mediasPath[folder];
        return path.join(this.#uploadPath, up);
    }

    static #generateFileName = () => Date.now() + '-' + Math.round(Math.random() * 1E9);
    static setGenerateFileName(func = this.#generateFileName) {
        this.#generateFileName = func;
    }


    static #storage = multer.diskStorage({
        destination: (req, file, cb) => {
            let folder = this.#fileFolder(file);
            if (!fs.existsSync(folder))
                fs.mkdirSync(folder, { recursive: true });

            cb(null, folder);
        },
        filename: (req, file, cb) => {
            cb(null, this.#generateFileName() + '.' + this.#fileExt(file)); // Nom unique pour éviter les conflits
        },

    });

    static middleware = multer({ storage: this.#storage });

    static deleteFileByName(filename) {
        if (!filename) return;
        this.deleteUploadedFiles([this.file(filename)]);
    }
    static deleteUploadedFiles(files) {
        files.forEach(file => {
            fs.unlink(file.path, (err) => {
                if (err) console.error(`Erreur lors de la suppression du fichier : ${file.path}`, err);
            });
        });
    }
    static file(filename) {
        const p = path.join(__dirname, "../../", UploadService.#fileFolder({
            originalname: filename,
        }), filename);

        return {
            filename,
            folder: UploadService.#fileFolder({
                originalname: filename,
            }),
            path: p,
        }
    }

    static getFile(req, res, next) {
        const filename = req.params.filename;
        if (!filename) return res.sendStatus(400);
        const p = UploadService.file(filename).path;

        if (!fs.existsSync(p)) return res.sendStatus(404)
        return res.sendFile(p);
    }


    static router() {

        const r = require("express").Router();

        r.get(this.#routePath, UploadService.getFile);

        return r;
    }
}


module.exports = UploadService;