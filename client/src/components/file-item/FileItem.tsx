import React, {FC} from 'react';
import {IFile} from '../../types/file';
import {IStarredFile} from '../../types/starredFile';
import {RiFolderUserFill} from 'react-icons/ri';
import {useAppDispatch} from '../../hooks/useAppDispatch';
import {
    pushToDirStack,
    setContextMenuFile,
    setCurrentDir,
    setInfoMenuFile
} from '../../store/reducers/filesReducer';
import {useTypedSelector} from '../../hooks/useTypedSelector';
import {IoMdImage} from 'react-icons/io';
import {calcLocation} from '../../utils/calcLocation';
import {MdSlowMotionVideo} from 'react-icons/md';
import {isIFile} from '../../utils/isIFile';
import './fileItem.scss'

interface FileItemProps {
    file: IFile | IStarredFile
}

const FileItem: FC<FileItemProps> = ({file}) => {
    const dispatch = useAppDispatch()
    const {dirStack, infoMenuFile} = useTypedSelector(state => state.files)
    const defaultContextMenu = document.querySelector('#default-context-menu') as HTMLElement
    const fileContextMenu = document.querySelector('#file-context-menu') as HTMLElement
    const dirContextMenu = document.querySelector('#dir-context-menu') as HTMLElement
    const sortContextMenu = document.querySelector('#sort-context-menu') as HTMLElement

    function openDirHandler(file: IFile) {
        if (file.type === 'dir') {
            dispatch(setInfoMenuFile(null))
            const idNum = dirStack[dirStack.length-1].id + 1
            dispatch(setCurrentDir(file._id))
            dispatch(pushToDirStack({id: idNum, name: file.name}))
        }
    }

    function openContextMenuHandler(e: React.MouseEvent<HTMLDivElement>) {
        defaultContextMenu.classList.remove('active')
        fileContextMenu.classList.remove('active')
        dirContextMenu.classList.remove('active')
        sortContextMenu.classList.remove('active')

        if (file.type !== 'dir') {
            dispatch(setContextMenuFile(file))
            fileContextMenu.classList.add('active')
            calcLocation(e, fileContextMenu)
        } else {
            dispatch(setContextMenuFile(file))
            dirContextMenu.classList.add('active')
            calcLocation(e, dirContextMenu)
        }
    }

    function openInfoMenuHandler() {
        if (infoMenuFile) dispatch(setInfoMenuFile(file))
    }

    return (
        <div
            className='file__item'
            onClick={() => openInfoMenuHandler()}
            onDoubleClick={isIFile(file) ? () => openDirHandler(file) : () => {}}
            onContextMenu={(e) => openContextMenuHandler(e)}
        >
            {file.type === 'dir' && <RiFolderUserFill size={22} className='mr-4 text-neutral-500'/>}
            {file.type === 'mp4' && <MdSlowMotionVideo size={22} className='mr-4 text-blue-600'/>}
            {file.type !== 'dir' && file.type !== 'mp4' &&
                <IoMdImage size={22} className='mr-4 text-orange-600'/>
            }
            <span className='file__name'>
                {file.name}
            </span>
        </div>
    )
}

export default FileItem;