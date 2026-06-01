import { useDispatch, useSelector } from "react-redux"
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"

// import { setCourse, setEditCourse } from "../../../../slices/courseSlice"
// import { setTurf ,setEditTurf} from "../../../../slices/turfSlice"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { useState } from "react"
import { FiEdit2 } from "react-icons/fi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"

import { formatDate } from "../../../../services/formatDate"
import { fetchOwnerTurfs,RemovedTurf } from '../../../../services/operation/TurfDetailsAPI';
import ConfirmationModal from "../../../common/ConfirmationModel"

export default function CoursesTable({ courses, setCourses }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const TRUNCATE_LENGTH = 30

  const handleCourseDelete = async (courseId) => {
    setLoading(true)
    const newData = {  turfId: courseId };
    await RemovedTurf(newData,token);
    const result = await fetchOwnerTurfs(token)
    if (result) {
      setCourses(result)
    }
    setConfirmationModal(null)
    setLoading(false)
  }

  // console.log("All Course ", courses)

  if(loading) {
    return (
        <div className="custom-loader"></div>
    )
    }


  return (
    <>
      <Table className="rounded-xl border border-black ">
        <Thead >
          <Tr className="flex gap-x-10 rounded-t-md border-b border-b-black px-6 py-2 text-black">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-black">
              Turfs
            </Th>
            <Th className="text-left text-sm md:px-5 font-medium md:mr-14 uppercase text-black">
              City
            </Th>
            <Th className="text-left md:px-5 text-sm font-medium uppercase md:space-x-6 text-black">
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-black">
                No courses found
                {/* TODO: Need to change this state */}
              </Td>
            </Tr>
          ) : (
            courses?.map((course) => (
              <Tr
                key={course?._id}
                className="flex gap-x-10 border-b mt-4 px-6 py-8 gap-4"
              >
                <Td colSpan={1}  className="flex flex-1 gap-x-4 p-3">
                  <img
                    src={course?.image}
                    alt={course?.turfName}
                    className="md:h-[148px] md:w-[220px] aspect-video rounded-lg object-cover"
                  />
                  <div className="flex flex-col gap-1 justify-between">
                    <p className="text-lg font-semibold text-richblack-5 mt-3">
                      {course.turfName}
                    </p>
                    <p className="text-xs text-richblack-300">
                      {course?.turfShortDesc.split(" ")?.length >
                      TRUNCATE_LENGTH
                        ? course.turfShortDesc
                            .split(" ")
                            .slice(0, TRUNCATE_LENGTH)
                            .join(" ") + "..."
                        : course.turfShortDesc}
                    </p>
                    <p className="text-[12px] text-black">
                      RegisterAt: {formatDate(course?.createdAt || course?.updatedAt)}
                    </p>
                    
                  </div>
                </Td>

                <Td className="md:p-5" >{course.city}</Td>
                <Td className="text-sm font-medium text-black md:p-5 md:space-x-6">
                  <button
                    disabled={loading}
                    onClick={() => {
                      navigate(`/dashboard/edit-turf/${course._id}`);
                    }}
                    title="Edit"
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-green-500 mr- mb-"
                  >
                    <FiEdit2 size={20} />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Do you want to remove this turf?",
                        text2:
                          "All the data related to this turf will be removed",
                        btn1Text: !loading ? "Delete" : "Loading...  ",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleCourseDelete(course._id)
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      })
                    }}
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}