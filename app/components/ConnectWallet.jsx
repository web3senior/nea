'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Web3 from 'web3'
import Icon from '../helper/MaterialIcon'
import { useAuth } from '../contexts/AuthContext'
import styles from './ConnectWallet.module.scss'
import Shimmer from '../helper/Shimmer'

export default function ConnectWallet() {
  const auth = useAuth()

  return (
    <div className={`${styles.connect} d-flex align-items-center justify-content-center`}>
      {auth.status === `loading` && <Shimmer style={{ width: `250px`, height: `45px` }} />}

      {!auth.wallet && <button onClick={auth.connect}>Connect</button>}

      {auth.profile && (
        <Link href={`#`}>
          <ul className={`${styles['wallet']} d-flex flex-row align-items-center justify-content-end`}>
            <li className={`d-flex flex-row align-items-center justify-content-center`}>
              {auth.balance}
              <div style={{ color: `var(--LUKSO)` }}>
                <span>$</span>
                <small style={{ fontSize: `12px`, position: `relative`, top: `-1px` }}>ETH</small>
              </div>
            </li>
            <li className={`d-flex flex-row align-items-center justify-content-end`}>
              {/* <Image
                className={`rounded`}
                alt={auth.wallet && `PFP`}
                title={auth.wallet && `${auth.wallet.slice(0, 4)}...${auth.wallet.slice(38)}`}
                width={40}
                height={40}
                priority
                src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${auth.wallet}`}
              /> */}
              <div className={`d-flex flex-row align-items-center justify-content-center h-100`}>
                <span>{`${auth.wallet.slice(0, 4)}...${auth.wallet.slice(38)}`}</span>
                <span style={{ fontSize: `2rem`, marginTop: `1rem` }}>🢓</span>
              </div>
            </li>
          </ul>
        </Link>
      )}
    </div>
  )
}
