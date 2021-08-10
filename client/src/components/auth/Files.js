import React from 'react'

import { Image } from 'react-bootstrap'

import '../../css/Files.css'

export default function Files({ currentUser, uploadFile, files, setFiles }) {
   
    return (
        <div
            className="d-flex justify-content-between"
        >   
            {   files &&
                // Object.keys(files[0]).length >= 1 
                files.length >= 1
                ? 
                <div className="Files__border">
                    <Image
                        key="1"
                        className="ms-1 Files__image rounded"
                        src={files.length > 0 && files[0].url}
                    />
                </div>
                : 
                <div
                    className="d-flex border rounded align-items-center justify-content-center"
                    style={{ minWidth: '110px', minHeight: '150px'}}
                >
                    <label>
                        <input id="image__1" type="file" hidden onChange={uploadFile}/>
                        <p 
                            for="image__1"
                            style={{ fontSize: 28, color: 'lightgray', cursor: 'pointer'}}
                        >
                            +
                        </p>
                    </label>
                </div>
            }

            {   files &&
                // Object.keys(files[0]).length >= 2 
                files.length >= 2
                ? 
                <div className="Files__border">
                    <Image
                        key="2"
                        className="ms-1 Files__image rounded"
                        src={files.length > 0 && files[1].url}
                    />
                </div>
                : 
                <div
                    className="d-flex border rounded align-items-center justify-content-center"
                    style={{ minWidth: '110px', minHeight: '150px'}}
                >
                    <label>
                        <input id="image__2" type="file" hidden onChange={uploadFile}/>
                        <p 
                            for="image__2"
                            style={{ fontSize: 28, color: 'lightgray', cursor: 'pointer'}}
                        >
                            +
                        </p>
                    </label>
                </div>
            }

            {   files &&
                // Object.keys(files[0]).length == 3
                files.length >= 3
                ? 
                <div className="Files__border">
                    <Image
                        key="3"
                        className="ms-1 Files__image rounded"
                        src={files.length > 0 && files[2].url}
                    />
                </div>
                : 
                <div
                    className="d-flex border rounded align-items-center justify-content-center"
                    style={{ minWidth: '110px', minHeight: '150px'}}
                >
                    <label>
                        <input id="image__3" type="file" hidden onChange={uploadFile}/>
                            <p 
                                for="image__3"
                                style={{ fontSize: 28, color: 'lightgray', cursor: 'pointer'}}
                            >
                                +
                            </p>
                    </label>
                </div>
            }
        </div>
    )
}