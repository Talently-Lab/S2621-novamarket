package com.novamarket.app

import android.app.Application
import com.novamarket.core.di.initKoin
import org.koin.android.ext.koin.androidContext

class KmpApp : Application() {
    override fun onCreate() {
        super.onCreate()
        initKoin{
            androidContext(this@KmpApp)
        }
    }
}
