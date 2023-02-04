import { Formik, Form, Field } from 'formik';
import { BsCloudUpload } from 'react-icons/bs';
import { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import Axios from 'axios';
import './ImageInput.css';
import ImageGallery from '../Image Gallery/ImageGallery';
const ImageField = () => {
    const fileref = useRef(null);
    const [myimage1, setmyimage] = useState(null);
    const initialData = {
        myimage: null,
    }
    const postimage = (event, setFieldValue) => {
        var files = event.target.files[0];
        setmyimage(URL.createObjectURL(event.target.files[0]));
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
                console.log("image data: ", e.target.result);
            }
        })
    }

    const sendImage = (values) => {
        console.log(values);
        const url = 'http://localhost:4000/imagedata';
        if (values.myimage !== null) {
            Axios.post(url, {
                "ImageData": values.myimage,
            });
            alert("send image successfully !");
        } else {
            alert("Please Choose Image!")
        }
    }
    return (
        <>
            <div className="container-fluid">
                <div className='navbar__top mt-2 w-100'>
                    <Formik
                        onSubmit={sendImage}
                        initialValues={initialData}
                    >
                        <Form>
                            <div className='col-lg-6 col-md-12 d-flex justify-content-lg-start justify-content-center mx-1 mb-3 position-relative'>
                                <div className='form-control upload__border input__field d-flex align-items-center justify-content-between'>
                                    {myimage1 !== null ?
                                        <img src={myimage1} alt="" width={"50px"} height={"30px"} /> : ''
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
                            <button className='btn btn-outline-primary send__button' type='submit'>Upload Image</button>
                        </Form>
                    </Formik>
                </div>
                <hr />
                <ImageGallery />
            </div>
        </>
    )
}

export default ImageField;
