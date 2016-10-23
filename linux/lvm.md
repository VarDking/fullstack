#LVM

> LVM 是一种可用在Linux内核的逻辑分卷管理器；可用于管理磁盘驱动器或其他类似的大容量存储设备。

###LVM基本组成

> Device-mapper 是Linxu内核的一个组件（从2.6开始），支持逻辑卷管理。被应用在LVM2和EVMS中。
> LVM最开始的版本并没有使用这个组件。

LVM利用Linux内核的device-mapper来实现存储系统的虚拟化（系统分区独立于底层硬件）。 通过LVM，你可以实现存储空间的抽象
化并在上面建立虚拟分区（virtual partitions）。可以更简便地扩大和缩小分区，可以增删分区时无需担心某个硬盘上没有足够的连续空
间。LVM是用来方便管理的，不会提供额外的安全保证。

LVM的基本组成：
- 物理卷Physical volume (PV)。
- 卷组Volume group (VG)。
- 逻辑卷Logical volume (LV)。
- 物理区域Physical extent (PE)。

示例:
两块物理硬盘
硬盘1 (/dev/sda):

| 分区1 50GB (物理卷)| 分区2 80GB (物理卷）|
|-------------------|------------------|
|   /dev/sda1       |    /dev/sda2     |

硬盘2 (/dev/sdb):

| 分区1 120GB (物理卷) |
|--------------------|
|    /dev/sdb1       |

LVM方式
卷组VG1 (/dev/MyStorage/ = /dev/sda1 + /dev/sda2 + /dev/sdb1):

| 逻辑卷1 15GB             | 逻辑卷2 35GB               |   逻辑卷3 200GB        |
|-------------------------|---------------------------|-----------------------|
|  /dev/MyStorage/rootvol |  /dev/MyStorage/homevol   |/dev/MyStorage/mediavol|

**优点**
- 使用卷组(VG)，使众多硬盘空间看起来像一个大硬盘。
- 使用逻辑卷（LV），可以创建跨越众多硬盘空间的分区
- 可以创建小的逻辑卷（LV），在空间不足时再动态调整它的大小。
- 在调整逻辑卷（LV）大小时可以不用考虑逻辑卷在硬盘上的位置，不用担心没有可用的连续空间。
- 可以在线（online）对逻辑卷（LV）和卷组（VG）进行创建、删除、调整大小等操作。LVM上的文件系统也需要重新调整大小，
  某些文件系统也支持这样的在线操作。
- 无需重新启动服务，就可以将服务中用到的逻辑卷（LV）在线（online）/动态（live）迁移至别的硬盘上。
- 允许创建快照，可以保存文件系统的备份，同时使服务的下线时间（downtime）降低到最小。

**缺点**
- 在系统设置时需要更复杂的额外步骤。

**注意**
GRUB Legacy不支持LVM

###创建物理卷（PV）

```shell
# lvmdiskscan         //列出可做物理卷的设备
# pvcreate <DEVICE>   //创建物理卷，device可以是磁盘，也可以是分区
# pvdisplay           //查看创建好的物理卷
```
###创建卷组（VG）
```shell
# vgcreate <volume_group> <physical_volume>   //创建卷组
# vgextend <volume_group> <physical_volume>   //将卷组扩大到物理卷
# vgdisplay                                   //查看物理卷
```
LVM支持将卷组与物理卷的创建聚合在一个命令中

```shell
# vgcreate myvg /dev/sda2 /dev/sdb1 /dev/sdc
```

###创建逻辑卷（LV）

```shell
# lvcreate -L <size> <volume_group> -n <logical_volume>
# lvcreate -L 10G myvg -n lvolhome /dev/sdc1                 //限制逻辑卷的物理位置
# lvcreate -l +100%FREE  <volume_group> -n <logical_volume>  //使用卷组的所有未使用空间
# lvdisplay                                                  //列出逻辑卷
```
创建好逻辑卷后，可以通过/dev/mapper/myvg-lvolhome或/dev/myvg/lvolhome来访问。
*为了使上述命令能正常运行，你可能需要加载device-mapper内核模块（请使用命令modprobe dm-mod）。*

###建立文件系统和挂载逻辑卷

```shell
# modprobe dm-mod           //加载device-mapper内核模块
# vgscan                    //扫描卷组
# vgchange -ay              //激活卷组
# mkfs.<fstype> /dev/mapper/<volume_group>-<logical_volume>       //创建文件系统
# mount /dev/mapper/<volume_group>-<logical_volume> /<mountpoint> //挂载分区
```

###在mkinitcpio.conf中加入lvm的钩子扩展
如果你的根文件系统基于LVM，你需要保证udev和lvm2这两个mkinitcpio的钩子扩展被启用。
udev默认已经预设好，不必手动启用了。你只需要编辑/etc/mkinitcpio.conf文件，在block与filesystem这两项中间插入lvm2：
```language
/etc/mkinitcpio.conf
HOOKS="base udev ... block lvm2 filesystems"
```

###内核参数
如果你的根文件系统位于逻辑分卷，则root= 内核参数必须指向一个映射设备，比如/dev/mapper/vg-name-lv-name。

###配置

- 如果你需要监控功能（这对快照是必须的），那么你需要启用lvmetad。
这只需要在/etc/lvm/lvm.conf文件中设置use_lvmetad = 1选项即可。目前这个选项已经成为预设选项，不需要手动设置。
可以通过修改/etc/lvm/lvm.conf文件中的auto_activation_volume_list参数限制自动激活的卷。如果存在问题，可以将此选项注释掉。

- 对于存在物理卷的设备，在扩增其容量之后或缩小其容量之前，必须使用pvresize命令对应地增加或减少物理卷的大小。

###物理卷容量修改

对于存在物理卷的设备，在扩增其容量之后或缩小其容量之前，必须使用pvresize命令对应地增加或减少物理卷的大小。

```shell
# pvresize /dev/sda1    //增大容量后，执行该命令扩展物理卷的大小。命令将自动探测设备当前大小并将物理卷扩展到其最大容量。
# pvresize --setphysicalvolumesize 40G /dev/sda1   //缩小物理卷大小为40G
```

###移动物理区域
```shell
# pvdisplay -v -m   //查看物理卷分段
# pvmove --alloc anywhere /dev/sdd1:307201-399668 /dev/sdd1:0-92466
```
[原文地址 archlinux](https://wiki.archlinux.org/index.php/LVM_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)