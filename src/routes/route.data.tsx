import { Routes, Route, Navigate, Router } from '@solidjs/router';
// import { AsyncResource } from 'async_hooks';
import { Component, lazy } from 'solid-js';


const Login = lazy(() => import('../containers/login/login'));
const SignUp = lazy(() => import('../containers/signup/signup'));
const AboutUs = lazy(() => import('../containers/aboutus/aboutus'));
const Profile = lazy(() => import('../containers/profile/profile'));
const EditProfile = lazy(() => import('../containers/profile/edit-profile/edit-profile'));
const Home = lazy(() => import('../containers/users/home/home'));
const DapurSaya = lazy(() => import('../containers/users/dapur-saya/dapur-saya'));
const RencanaMasak = lazy(() => import('../containers/users/rencana-masak/rencana-masak'));
const BahanLangkah = lazy(() => import('../containers/users/detail-resep/bahan-langkah'));
const UlasanResep = lazy(() => import('../containers/users/detail-resep/ulasan-resep'));
const Unggah_resep = lazy(() => import('../containers/unggah_resep/unggah_resep'));
const Unggah_gambar = lazy(() => import('../containers/unggah_resep/unggah_gambar'));

const EditResep = lazy(() => import('../containers/users/edit-resep/edit-resep'));

const getPath = () => {
    return "/home";
}

const RouteData: Component = () => {
    return (
        // <Router>
        <Routes>
            <Route path="/" element={<Navigate href={getPath} />} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/about-us" component={AboutUs} />
            <Route path="/profile" component={Profile}/>
            <Route path="/editprofile" component={EditProfile}/>
            <Route path="/home" component={Home} />
            <Route path="/dapur_saya" component={DapurSaya} />
            <Route path="/rencana_masak" component={RencanaMasak} />
            <Route path="/detail_resep_bahan_langkah" component={BahanLangkah} />
            <Route path="/detail_resep_ulasan" component={UlasanResep} />
            <Route path="/edit_Resep" component={EditResep} />

            <Route path="/unggah_resep" component={Unggah_resep} />
            <Route path="/unggah_gambar" component={Unggah_gambar} />
        </Routes>
        // </Router>
    )
}

export default RouteData;