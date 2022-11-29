const UserCard = ({userAddress}) => {
    return (
        <div className='border-amber-200 border-2 p-4 flex justify-start items-center rounded-xl space-x-6'>
            <div className='flex flex-col justify-center w-full'>
                <div className='text-xs font-normal'>User ID</div>
                <div className='text-sm font-normal break-words w-60 sm:w-96'>{userAddress.toBase58()}</div>
            </div>
        </div>
    )
}

export default UserCard