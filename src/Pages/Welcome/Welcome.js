import React from 'react';
import { useTheme } from '../../Context/Context';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../Components/LanguageSwitcher/LanguageSwitcher';
import './Welcome.css'
import Signpage from '../../Components/signpage/signpage';
import Loginpage from '../../Components/Loginpage/Loginpage';

export default function Welcome() {
  const { isLogin, setisLogin } = useTheme();
  const { ShowSignForm, setShowSignForm } = useTheme();
  const { t } = useTranslation();


  function islogintrue() {
    setisLogin(true)

  }
  return (
    <div className='welcomepage'>
      <div>
        <h1>{t('welcome')}</h1>
      </div>
      <LanguageSwitcher />
      <div className='forms'>
        {ShowSignForm ? (
          <>
            <Signpage />
          </>
        ) : (
          <>
            <Loginpage />
          </>
        )}
      </div>
    </div>
  )
}

