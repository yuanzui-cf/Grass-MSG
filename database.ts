class Store{
    _dbname:string;
    _dbpath:string;
    _data:any = {};
    fs = require("fs");
    constructor(_dbname:string, _dbpath:string = ""){
        this._dbname = _dbname;
        this._dbpath = _dbpath;
    }
    load(){
        this.fs.access(`${this._dbpath}${this._dbname}.data`, this.fs.constants.F_OK, (err:string|null) => {
            if(!err){
                this._data = JSON.parse(this.fs.readFileSync(`${this._dbpath}${this._dbname}.data`, "UTF-8"));
            }
            else{
                this.fs.writeFileSync(`${this._dbpath}${this._dbname}.data`, "{}");
            }
        });
    }
    write(_content:string, _dbname:string, _entry:string, _id:number = 0){
        if(!this._data[_dbname]){
            this._data[_dbname] = {};
        }
        if(!this._data[_dbname][_entry]){
            this._data[_dbname][_entry] = [];
        }
        this._data[_dbname][_entry][_id] = _content;
        this.fs.writeFileSync(`${this._dbpath}${this._dbname}.data`, JSON.stringify(this._data));
    }
    read(_dbname:string, _entry:string, _id:number = 0){
        return this._data[_dbname][_entry][_id];
    }
    getLength(_dbname:string, _entry:string){
        return this._data[_dbname][_entry].length;
    }
}
export { Store };