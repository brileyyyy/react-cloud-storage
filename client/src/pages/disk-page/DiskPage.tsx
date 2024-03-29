import React, {FC, useEffect, useState} from 'react';
import {useAppDispatch} from '../../hooks/useAppDispatch';
import {getFiles, setInfoMenuFile, setUploadPopupDisplay} from '../../store/reducers/filesReducer';
import {useTypedSelector} from '../../hooks/useTypedSelector';
import FileList from '../../components/file-list/FileList';
import Breadcrumbs from '../../components/UI/breadcrumbs/Breadcrumbs';
import CreatePopup from '../../components/UI/popup/CreatePopup';
import UploadPopup from '../../components/UI/popup/UploadPopup';
import FileUploadPopup from '../../components/UI/file-upload-popup/FileUploadPopup';
import {calcLocation} from '../../utils/calcLocation';
import Navbar from '../../components/UI/navbar/Navbar';
import LeftSideMenu from '../../components/left-side-menu/LeftSideMenu';
import RightInfoMenu from '../../components/right-info-menu/RightInfoMenu';
import './diskPage.scss'

interface DiskPageProps {
    sortValue: string | null
}

const DiskPage: FC<DiskPageProps> = ({sortValue}) => {
    const dispatch = useAppDispatch()
    const {files, currentDir, uploadPopupDisplay, infoMenuFile} = useTypedSelector(state => state.files)
    const [dragEnter, setDragEnter] = useState(false)

    const defaultContextMenu = document.querySelector('#default-context-menu') as HTMLElement
    const fileContextMenu = document.querySelector('#file-context-menu') as HTMLElement
    const dirContextMenu = document.querySelector('#dir-context-menu') as HTMLElement
    const sortContextMenu = document.querySelector('#sort-context-menu') as HTMLElement

    useEffect(() => {
        dispatch(getFiles({dispatch, currentDir, sortValue}))
    }, [currentDir, sortValue])

    function dragEnterHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        e.stopPropagation()
        setDragEnter(true)
        if (uploadPopupDisplay === 'none') {
            dispatch(setUploadPopupDisplay('block'))
        }
    }

    function dragLeaveHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        e.stopPropagation()
    }

    function openDefaultContextMenuHandler(e: React.MouseEvent<HTMLDivElement>) {
        const target = e.target as Element

        if (!target.classList.contains('file__item') && target.tagName !== 'path'
            && target.tagName !== 'svg' && target.tagName !== 'SPAN') {
            fileContextMenu.classList.remove('active')
            dirContextMenu.classList.remove('active')
            sortContextMenu.classList.remove('active')
            defaultContextMenu.classList.add('active')
            calcLocation(e, defaultContextMenu)
        }
    }

    function closeContextMenu(e: React.MouseEvent<HTMLDivElement>) {
        const target = e.target as Element

        fileContextMenu.classList.remove('active')
        dirContextMenu.classList.remove('active')

        if (!target.getAttribute('data-sort')) {
            sortContextMenu.classList.remove('active')
        }
        if (!target.getAttribute('data-create')) {
            defaultContextMenu.classList.remove('active')
        }
        if (!target.classList.contains('file__item') && !target.getAttribute('data-create')
            && target.tagName !== 'path' && target.tagName !== 'svg' && target.tagName !== 'SPAN') {
            dispatch(setInfoMenuFile(null))
        }
    }

    return (
        <div>
            <Navbar/>
            <div
                onDragEnter={e => dragEnterHandler(e)}
                onDragLeave={e => dragLeaveHandler(e)}
                onDragOver={e => dragLeaveHandler(e)}
                onClick={e => closeContextMenu(e)}
                className='grid grid-primary'
            >
                <LeftSideMenu/>
                <div
                    className='mt-6'
                    onContextMenu={e => openDefaultContextMenuHandler(e)}
                >
                    <Breadcrumbs/>
                    <div className='px-2 h-auto h-max-min-540 flex flex-col overflow-y-auto'>
                        <FileList allFiles={files} sortValue={sortValue}/>
                        <CreatePopup/>
                        <UploadPopup dragEnter={dragEnter} setDragEnter={setDragEnter}/>
                        <FileUploadPopup/>
                    </div>
                </div>
                <RightInfoMenu file={infoMenuFile}/>
            </div>
        </div>

    );
};

export default DiskPage;