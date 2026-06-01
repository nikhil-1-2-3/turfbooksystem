import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineCurrencyRupee } from 'react-icons/hi';
import { setStep, setTurf, setEditTurf } from '../../../../../slices/turfSlice';
import { editCourseDetails, addCourseDetails } from "../../../../../services/operation/TurfDetailsAPI";
import IconBtn from '../../../../common/IconBtn';
import { TURF_STATUS } from '../../../../../utils/constants';
import { toast } from 'react-hot-toast';
import Upload from './Upload'
import Spinner from '../../../../common/spinner/Spinner';

const TurfInformationForm = () => {

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { editTurf, turf, priceTime } = useSelector((state) => state.turf);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editTurf) {
            console.log("Turf: ", turf);
            setValue("turfName", turf.turfName);
            setValue("turfShortDesc", turf.turfShortDesc);
            setValue("turfimage", turf.image);
            setValue("area", turf.area);
            setValue("city", turf.city);
            setValue("pinCode", turf.pinCode);
        }

    }, [])

    const isFormUpdated = () => {
        const currentValues = getValues();

        if (currentValues.turfName !== turf.turfName ||
            currentValues.turfShortDesc !== turf.turfShortDesc ||
            currentValues.area !== turf.area ||
            currentValues.city !== turf.city ||
            currentValues.pinCode !== turf.pinCode ||
            currentValues.turfImage !== turf.image
        )
            return true;
        else
            return false;
    }

    //handles next button click 
    const onSubmit = async (data) => {

        // this is used when we go in next step and then again come in back in previous step
        if (editTurf) {
            if (isFormUpdated()) {
                const currentValues = getValues();
                const formData = new FormData();
                console.log("data: ", data);

                formData.append("turfId", turf._id);
                if (currentValues.turfName !== turf.turfName) {
                    formData.append("turfName", data.turfName);
                }

                if (currentValues.turfShortDesc !== turf.turfShortDesc) {
                    formData.append("turfShortDesc", data.turfShortDesc);
                }

                if (currentValues.area !== turf.area) {
                    formData.append("area", data.area);
                }

                if (currentValues.city !== turf.city) {
                    formData.append("city", data.city);
                }

                if (currentValues.pinCode !== turf.pinCode) {
                    formData.append("pinCode", data.pinCode);
                }
                if (currentValues.Image !== turf.image) {
                    formData.append("thumbnailImage", data.turfImage);
                }


                setLoading(true);
                const result = await editCourseDetails(formData, token);
                setLoading(false);
                if (result) {
                    // dispatch(setEditTurf(false));
                    dispatch(setStep(2));
                    dispatch(setTurf(result));
                    if (priceTime.length == 0) {
                        dispatch(setEditTurf(false));
                    }
                }
            }
            else {
                toast.error("NO Changes made so far");
            }

            return;
        }

        // create a new course
        const formData = new FormData();
        formData.append("turfName", data.turfName);
        formData.append("turfDescription", data.turfShortDesc);
        formData.append("area", data.area);
        formData.append("city", data.city);
        formData.append("pinCode", data.pinCode);
        formData.append("status", TURF_STATUS.DRAFT);
        formData.append("thumbnailImage", data.turfImage);

        setLoading(true);
        console.log("BEFORE add course API call");
        console.log("PRINTING FORMDATA", formData);
        const result = await addCourseDetails(formData, token);
        if (result) {
            dispatch(setStep(2));
            dispatch(setTurf(result));
        }
        setLoading(false);
        console.log("AFTER add course API call");
        console.log("PRINTING FORMDATA", [...formData]);
        console.log("PRINTING result", result);

    }

    const handleContinue = async () => {
        dispatch(setStep(2));
        if (priceTime.length == 0) {
            dispatch(setEditTurf(false));
        }
        console.log("price time in continue : ", priceTime);
    }



    return (
        <>
            {
                loading ? (<Spinner></Spinner>) : (<>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='space-y-8 rounded-md border-[1px] border-richblack-700 bg-white p-6'
                    >
                        <div className='flex flex-col space-y-2'>
                            <label className='text-sm text-richblack-5' htmlFor='turfName'>Turf Name<sup className='text-red-700'>*</sup></label>
                            <input
                                id='turfName'
                                placeholder='Enter Turf Name'
                                {...register("turfName", { required: true })}
                                className='form-style w-full p-2'
                            />
                            {
                                errors.turfName && (
                                    <span className='ml-2 text-xs tracking-wide text-red-700'>Turf Name is Required**</span>
                                )
                            }
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label className='text-sm text-richblack-5' htmlFor='turfShortDesc'>Turf Short Description<sup className='text-red-700'>*</sup></label>
                            <textarea
                                id='turfShortDesc'
                                placeholder='Enter Description'
                                {...register("turfShortDesc", { required: true })}
                                className='form-style resize-x-none min-h-[130px] w-full p-2 text-md'
                            />
                            {
                                errors.turfShortDesc && (<span className='ml-2 text-xs tracking-wide text-red-700'>
                                    Turf Description is required**
                                </span>)
                            }
                        </div>


                        {/*component for uploading and showing preview of media */}
                        <Upload
                            name={"turfImage"}
                            label={"turfImage"}
                            register={register}
                            errors={errors}
                            setValue={setValue}
                        />

                        <div className='flex flex-col space-y-2'>
                            <label className='text-sm text-richblack-5' htmlFor='area'>Area<sup className='text-red-700'>*</sup></label>
                            <input
                                id='area'
                                placeholder='Enter area'
                                {...register("area", { required: true })}
                                className='form-style w-full p-2'
                            />
                            {
                                errors.area && (
                                    <span className='ml-2 text-xs tracking-wide text-red-700'>Area is Required**</span>
                                )
                            }
                        </div>

                        <div className='hidden'>
                            <input
                                id='city'
                                type='hidden'
                                value='Surat'
                                {...register("city")}
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label className='text-sm text-richblack-5' htmlFor='area'>Pin Code<sup className='text-red-700'>*</sup></label>
                            <input
                                id='pincode'
                                placeholder='Enter pincode'
                                {...register("pinCode", { required: true })}
                                className='form-style w-full p-2'
                            />
                            {
                                errors.pincode && (
                                    <span className='ml-2 text-xs tracking-wide text-red-700'>Pin Code is Required**</span>
                                )
                            }
                        </div>

                        <div className='flex justify-end gap-x-2'>
                            {
                                editTurf && (
                                    <button
                                        onClick={handleContinue}
                                        className=' text-[10px] text-white md:text-sm p-2 px-1 font-semibold rounded-md flex items-center gap-x-2 bg-zinc-500'
                                    >
                                        Continue Without Saving
                                    </button>
                                )
                            }

                            <IconBtn type={"submit"}
                                text={!editTurf ? "Next" : "Save Changes"}
                            />
                        </div>
                    </form>
                </>

                )
            }

        </>

    )
}

export default TurfInformationForm;