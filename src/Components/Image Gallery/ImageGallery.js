import { useState, useRef } from "react";
import imageCompression from 'browser-image-compression';
import { Formik, Form, Field } from 'formik';
import axios from "axios";
import { FiEdit3 } from 'react-icons/fi';
import { BsCloudUpload } from 'react-icons/bs';
import { AiOutlineSend } from 'react-icons/ai';
const ImageGallery = () => {
    const [post, setPost] = useState();
    const show = true;
    const [imageId, setimageId] = useState(null)
    const [changeImg, setchangeImg] = useState(false);
    let [imageUrl, setimageUrl] = useState(null)
    const fileref = useRef(null);
    const initialData = {
        myimage: null,
    }
    const postimage = (event, setFieldValue) => {
        var files = event.target.files[0];
        const options = {
            maxSizeMB: 0.3,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        }
        let reader = new FileReader();
        imageCompression(files, options).then(compressedimg => {
            console.log("coresseding", compressedimg)
            reader.readAsDataURL(compressedimg);
            reader.onload = (e) => {
                setFieldValue("myimage", e.target.result);
                setimageUrl(e.target.result)
                console.log("image data: ", e.target.result);
            }
        })
    }

    const updateImage = (val) => {
        const UPDATEDIMAGE = { ImageData: val.myimage };
        axios.put(`http://localhost:4000/imagedata/${imageId}`, UPDATEDIMAGE)
        alert("Update image successfully !");
    }

    const defaultSetting = () => {
        setimageUrl(null);
        setimageId(null);
    }

    const handleClick = () => {
        axios
            .get("http://localhost:4000/imagedata")
            .then(res => {
                console.log(res);
                setPost({ dogs: res?.data });
            })
            .catch(err => console.log(err));
    };
    const imageInfo = (imgdata, imgurl) => {
        setimageId(imgdata);
        setimageUrl(imgurl);
    }

    return (
        <>
            <div className="row">
                {changeImg === true ?
                    <div className='navbar__top mt-2 w-100'>
                        <Formik
                            onSubmit={updateImage}
                            initialValues={initialData}
                        >
                            <Form>
                                <div className='col-lg-6 col-md-12 d-flex justify-content-lg-start justify-content-center mx-1 mb-3 position-relative'>
                                    <div className='form-control upload__border input__field d-flex align-items-center justify-content-between'>
                                        {imageUrl !== null ?
                                            <img src={imageUrl} alt="" width={"70px"} height={"40px"} className='preview__image' /> : <div></div>
                                        }
                                        <span onClick={() => { fileref.current.click() }} className='Upload__button'><BsCloudUpload className='upload__icon' /></span>
                                    </div>
                                    <Field name="myimage">
                                        {({ form }) => {
                                            const { setFieldValue } = form;
                                            return (<input className="form-control upload__border input__field" ref={fileref} type="file" onChange={(e) => postimage(e, setFieldValue)} hidden />)
                                        }}
                                    </Field>
                                </div>
                                <button className='btn btn-outline-primary send__button' type='submit'>Update Image <AiOutlineSend /></button>
                            </Form>
                        </Formik>
                    </div> : ''
                }
                <div className="col-6">
                    <div>
                        <button
                            className="mt-3 btn btn-outline-success w-25"
                            type="button"
                            onClick={handleClick}
                        >get images</button>
                    </div>
                    {show &&
                        post?.dogs.map((alldata, index) => (
                            <img
                                height={'180px'}
                                width={'140px'}
                                className="border border-success mt-3 d-inline"
                                src={post?.dogs[index]?.ImageData}
                                key={alldata}
                                alt="images"
                                style={{ cursor: "pointer", margin: "5px" }}
                                onClick={() => { imageInfo(post?.dogs[index]?.id, post?.dogs[index]?.ImageData) }}
                            />
                        ))}
                </div>
                {imageId && imageUrl !== null ?
                    <div className="col-5">
                        <Formik
                            onSubmit={updateImage}
                            initialValues={initialData}
                        >
                            {({ values }) => (
                                <Form>
                                    <div className="row d-flex justify-content-center w-100">
                                        <img src={imageUrl} style={{ height: "280px", width: "280px" }} alt="" />
                                    </div>
                                    <div className="row d-flex justify-content-center p-5">
                                        <button type="button" className="btn btn-outline-primary w-25 m-2" onClick={() => { setchangeImg(true) }} ><FiEdit3 /> Edit Image</button>
                                        <Field name="myimage">
                                            {({ form }) => {
                                                const { setFieldValue } = form;
                                                return (<input className="form-control upload__border input__field" ref={fileref} type="file" onChange={(e) => postimage(e, setFieldValue)} hidden />)
                                            }}
                                        </Field>
                                        {values.myimage !== null ?
                                            <button className="btn btn-outline-success w-25 m-2" type="submit">Save</button> : ''
                                        }
                                        <button className="btn btn-outline-danger w-25 m-2" type="button" onClick={defaultSetting}>Cancel</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div> : ''
                }
            </div>
        </>
    )
}

export default ImageGallery;
