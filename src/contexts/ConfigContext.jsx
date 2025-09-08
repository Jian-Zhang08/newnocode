import { createContext, useContext, useState, useEffect } from 'react';

const ConfigContext = createContext();

export function useConfig() {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
}

export function ConfigProvider({ children }) {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            const response = await fetch('/app-config.json');
            const configData = await response.json();
            setConfig(configData);

            // Apply theme colors to CSS variables
            if (configData.theme) {
                applyTheme(configData.theme);
            }
        } catch (error) {
            console.error('Failed to load app configuration:', error);
            // Fallback to default config
            setConfig(getDefaultConfig());
        } finally {
            setLoading(false);
        }
    };

    const applyTheme = (theme) => {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', theme.primaryColor);
        root.style.setProperty('--secondary-color', theme.secondaryColor);
        root.style.setProperty('--background-color', theme.backgroundColor);
        root.style.setProperty('--text-color', theme.textColor);
    };

    const getDefaultConfig = () => ({
        app: {
            name: "Smartz",
            version: "1.0.0",
            description: "Smart Home Management System"
        },
        company: {
            name: "Smartz",
            displayName: "Smartz Eaze",
            poweredBy: "Aedify"
        },
        theme: {
            primaryColor: "#4A90E2",
            secondaryColor: "#2c3e50",
            backgroundColor: "#f5f5f5",
            textColor: "#333333",
            logoStyle: "lowercase"
        },
        modules: {
            available: [],
            selected: ["dashboard", "user-management"]
        },
        features: {
            showCameraView: false,
            showUserManagement: true,
            enableNotifications: true
        },
        ui: {
            showStatusBar: false,
            mobileFirst: true
        }
    });

    const isModuleEnabled = (moduleId) => {
        return config?.modules?.selected?.includes(moduleId) || false;
    };

    const getEnabledModules = () => {
        if (!config?.modules?.available || !config?.modules?.selected) {
            return [];
        }

        return config.modules.available.filter(module =>
            config.modules.selected.includes(module.id)
        );
    };

    const getModuleByRoute = (route) => {
        if (!config?.modules?.available) return null;

        return config.modules.available.find(module =>
            module.routes.includes(route)
        );
    };

    const updateConfig = (newConfig) => {
        setConfig(newConfig);
        if (newConfig.theme) {
            applyTheme(newConfig.theme);
        }
    };

    const value = {
        config,
        loading,
        isModuleEnabled,
        getEnabledModules,
        getModuleByRoute,
        updateConfig,
        loadConfig
    };

    return (
        <ConfigContext.Provider value={value}>
            {!loading && children}
        </ConfigContext.Provider>
    );
}
