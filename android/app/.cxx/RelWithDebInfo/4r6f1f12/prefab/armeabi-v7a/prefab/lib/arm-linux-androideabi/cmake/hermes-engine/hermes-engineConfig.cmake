if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "/private/var/root/.gradle/caches/8.13/transforms/19dc7c2350e558785a637d7770d6ea84/transformed/hermes-android-250829098.0.9-release/prefab/modules/hermesvm/libs/android.armeabi-v7a/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "/private/var/root/.gradle/caches/8.13/transforms/19dc7c2350e558785a637d7770d6ea84/transformed/hermes-android-250829098.0.9-release/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

