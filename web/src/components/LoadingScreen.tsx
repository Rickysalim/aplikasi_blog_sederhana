import { alpha, styled } from '@mui/material/styles';
import { Box, SxProps } from '@mui/material';
import ProgressBar from './ProgressBar';
import Iconify from './Iconify';


const RootStyle = styled('div')(({ theme }) => ({
    right: 0,
    bottom: 0,
    zIndex: 99999,
    width: '100%',
    height: '100%',
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

type Props = {
    //   isLoading?: boolean;
    sx?: SxProps;
};

export default function LoadingScreen({ ...other }: Props) {
    return (
        <>
            <ProgressBar />
            <RootStyle {...other}>
                <Iconify icon={'eos-icons:loading'} 
                sx={{
                 width: '100px',
                 height: '100px'
                }} />
            </RootStyle>
        </>
    );
}
