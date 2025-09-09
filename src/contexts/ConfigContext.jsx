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

            // Also apply user UI settings if they exist
            if (configData.user?.selections?.uiSettings) {
                applyTheme(configData.user.selections.uiSettings);
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

        // Apply color theme
        if (theme.primaryColor) {
            root.style.setProperty('--primary-color', theme.primaryColor);
        }
        if (theme.secondaryColor) {
            root.style.setProperty('--secondary-color', theme.secondaryColor);
        }
        if (theme.backgroundColor) {
            root.style.setProperty('--background-color', theme.backgroundColor);
        }
        if (theme.textColor) {
            root.style.setProperty('--text-color', theme.textColor);
        }

        // Apply UI settings as CSS custom properties
        if (theme.showStatusBar !== undefined) {
            root.style.setProperty('--show-status-bar', theme.showStatusBar ? 'block' : 'none');
        }
        if (theme.showNavigationIcons !== undefined) {
            root.style.setProperty('--show-navigation-icons', theme.showNavigationIcons ? 'block' : 'none');
        }
        if (theme.showPoweredBy !== undefined) {
            root.style.setProperty('--show-powered-by', theme.showPoweredBy ? 'block' : 'none');
        }
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
