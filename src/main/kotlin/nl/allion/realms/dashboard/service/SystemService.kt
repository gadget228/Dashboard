package nl.allion.realms.dashboard.service

import org.springframework.stereotype.Service
import oshi.SystemInfo

@Service
class SystemService {
    private val systemInfo = SystemInfo()
    private val hardware = systemInfo.hardware
    private val processor = hardware.processor

    fun getCpuUsagePercent(): Double {
        val prevTicks = processor.systemCpuLoadTicks
        Thread.sleep(1000) // Sample delay for delta
        val currTicks = processor.systemCpuLoadTicks
        return processor.getSystemCpuLoadBetweenTicks(prevTicks) * 100
    }

    fun getMemoryStats(): Map<String, Long> {
        val memory = hardware.memory
        return mapOf(
            "totalMemory" to memory.total,
            "availableMemory" to memory.available,
            "usedMemory" to (memory.total - memory.available)
        )
    }

    fun getDiskStats(): List<Map<String, Any>> {
        return hardware.diskStores.map { disk ->
            disk.updateAttributes()
            mapOf(
                "name" to disk.name,
                "model" to disk.model,
                "size" to disk.size,
                "readBytes" to disk.readBytes,
                "writeBytes" to disk.writeBytes
            )
        }
    }

    fun getNetworkStats(): List<Map<String, Any>> {
        val interfaces = hardware.networkIFs
        return interfaces.map { net ->
            net.updateAttributes()
            mapOf(
                "name" to net.name,
                "displayName" to net.displayName,
                "bytesSent" to net.bytesSent,
                "bytesRecv" to net.bytesRecv,
                "packetsSent" to net.packetsSent,
                "packetsRecv" to net.packetsRecv,
                "speed" to net.speed
            )
        }
    }

    fun getAllStats(): Map<String, Any> {
        return mapOf(
            "cpuUsagePercent" to getCpuUsagePercent(),
            "memory" to getMemoryStats(),
            "disks" to getDiskStats(),
            "network" to getNetworkStats()
        )
    }
}