import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import RatingStars from './RatingStars';


// import './styles.css';

// import required modules
import { Autoplay, FreeMode, Pagination, Navigation, Keyboard, Mousewheel } from 'swiper/modules';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import "react-loading-skeleton/dist/skeleton.css";

const Slider = ({ Courses }) => {

    return (
        <div>
            {
                Courses?.length && (
                    <Swiper
                        mousewheel={
                            {
                                enabled: true,
                                forceToAxis: true,
                            }
                        }
                        keyboard={
                            {
                                enabled: true,
                                onlyInViewport: true,
                            }
                        }
                        centeredSlides={true}
                        allowSlidePrev={true}
                        slidesPerView={1}
                        // loop={true}
                        spaceBetween={10}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Pagination, Autoplay, Navigation, FreeMode, Mousewheel, Keyboard]}
                        className="mySwiper md:pt-5 text-black"
                        autoplay={{
                            delay: 1000,
                            disableOnInteraction: false,
                        }}
                        style={{
                            "--swiper-navigation-size": "20px",
                        }}
                        freeMode={true}
                        navigation={false}
                        breakpoints={{
                            300: { slidesPerView: 1, spaceBetween: 10, },
                            640: { slidesPerView: 2.2, },
                            1024: { slidesPerView: 3.1, }
                        }}


                    >
                        {
                            Courses?.map((review, index) => (
                                <SwiperSlide key={index}>
                                    <div className='flex flex-col gap-3 min-h-[150px] m-auto md:mx-0 bg-white p-3 text-[14px] text-richblack-25 mb-4'>
                                        <div className='flex items-center gap-4'>
                                            <img src={review?.user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user.lastName}`} alt="alt" className='h-9 w-9 rounded-full object-cover' />
                                            <div className='flex flex-col'>
                                                <h3 className='font-semibold text-richblack-5'>{review?.user?.firstName} {review?.user.lastName}</h3>
                                                <p className='text-[12px] font-medium text-richblack-500'>{review?.turf?.turfName}</p>
                                            </div>
                                        </div>
                                        <div className='font-medium text-richblack-25'>{review?.review.slice(0, 70)}...</div>
                                        <RatingStars Review_Count={review?.rating} />
                                    </div>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                ) 
                // : 
                // (
                //     <div className='flex gap-4 overflow-hidden bg-black'>
                //         <SkeletonTheme baseColor="#2C333F" highlightColor="#161D29">
                //             <div className=''>
                //                 <Skeleton className='md:h-[200px] lg:w-[400px] h-[100px] w-[200px] rounded-xl' />
                //                 <Skeleton className='md:h-[20px] w-[70px] rounded-md' />
                //                 <Skeleton className='md:h-[20px] md:w-[400px] rounded-md' />
                //                 <Skeleton className='md:h-[20px] md:w-[400px] rounded-md' />
                //             </div>
                //         </SkeletonTheme>
                //         <SkeletonTheme baseColor="#2C333F" highlightColor="#161D29">
                //             <div className=''>
                //                 <Skeleton className='md:h-[200px] lg:w-[400px] h-[100px] w-[200px] rounded-xl' />
                //                 <Skeleton className='md:h-[20px] w-[70px] rounded-md' />
                //                 <Skeleton className='md:h-[20px] md:w-[400px] rounded-md' />
                //                 <Skeleton className='md:h-[20px] md:w-[400px] rounded-md' />
                //             </div>
                //         </SkeletonTheme>
                //         <SkeletonTheme baseColor="#2C333F" highlightColor="#161D29">
                //             <div className=''>
                //                 <Skeleton className='md:h-[200px] lg:w-[400px] h-[100px] w-[200px] rounded-xl' />
                //                 <Skeleton className='md:h-[20px] w-[70px] rounded-md' />
                //                 <Skeleton className='md:h-[20px] md:w-[400px] rounded-md' />
                //                 <Skeleton className='md:h-[20px] md:w-[400px] rounded-md' />
                //             </div>
                //         </SkeletonTheme>
                //         {/* <div className='text-white'>no data found</div> */}
                //     </div>
                // )

            }
        </div>
    )
}

export default Slider


